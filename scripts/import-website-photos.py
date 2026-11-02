"""Prepare the named photos in Downloads for the website.

The HEIC files here use 512px HEIF tile grids. The bundled FFmpeg decoder
exposes those tiles separately, so they are assembled before resizing.
"""

from pathlib import Path
from tempfile import TemporaryDirectory
import math
import re
import subprocess

from PIL import Image, ImageOps


SOURCE = Path.home() / "Downloads/Photos for website"
DESTINATION = Path(__file__).resolve().parents[1] / "public/images/notebook"
FFMPEG = Path("/Applications/Badlion Client.app/Contents/ffmpeg")
MAX_EDGE = 1800
ROTATE_CLOCKWISE = {"japan", "japanfencing", "japanstreetfood", "japanuniversal", "macao"}


def load_heic(path: Path) -> Image.Image:
    probe = subprocess.run(
        [str(FFMPEG), "-hide_banner", "-i", str(path)],
        capture_output=True, text=True, check=False,
    ).stderr
    match = re.search(r"Stream group #0:0[^\n]*?, (\d+)x(\d+) \(default\)", probe)
    if not match:
        raise RuntimeError(f"Could not read HEIC grid dimensions: {path.name}")
    width, height = map(int, match.groups())
    columns, rows = math.ceil(width / 512), math.ceil(height / 512)

    with TemporaryDirectory() as temporary:
        command = [str(FFMPEG), "-loglevel", "error", "-i", str(path)]
        for index in range(columns * rows):
            command += [
                "-map", f"0:{index}", "-frames:v", "1", "-update", "1",
                "-y", str(Path(temporary) / f"{index:02}.png"),
            ]
        subprocess.run(command, check=True)
        full = Image.new("RGB", (columns * 512, rows * 512))
        for index in range(columns * rows):
            with Image.open(Path(temporary) / f"{index:02}.png") as tile:
                full.paste(tile.convert("RGB"), ((index % columns) * 512, (index // columns) * 512))
        return full.crop((0, 0, width, height))


def main() -> None:
    if not FFMPEG.exists():
        raise SystemExit(f"FFmpeg is missing: {FFMPEG}")
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for path in sorted(SOURCE.iterdir()):
        if path.suffix.lower() not in {".heic", ".jpg", ".jpeg"}:
            continue
        image = load_heic(path) if path.suffix.lower() == ".heic" else ImageOps.exif_transpose(Image.open(path))
        if path.stem.lower() in ROTATE_CLOCKWISE:
            image = image.transpose(Image.Transpose.ROTATE_270)
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        stem = path.stem.lower().replace(" ", "-")
        if stem == "shanghai":
            stem += f"-{path.suffix.lower().lstrip('.')}"
        output = DESTINATION / f"{stem}.webp"
        image.convert("RGB").save(output, "WEBP", quality=84, method=6)
        print(f"{path.name} → {output.name} ({image.width}×{image.height})")


if __name__ == "__main__":
    main()
