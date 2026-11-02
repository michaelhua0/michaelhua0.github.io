"""Create compact SVG state paths from the Census 2024 cartographic boundary file.

Download https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip
and pass the ZIP path as the first argument. The output is committed, so the site
does not fetch map data at runtime.
"""

import math
import struct
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/data/usStatePaths.ts"


def records_from_dbf(data):
    count, header_length, record_length = struct.unpack_from("<IHH", data, 4)
    fields = []
    position = 32
    offset = 1
    while data[position] != 13:
        field = data[position : position + 32]
        name = field[:11].split(b"\0", 1)[0].decode()
        length = field[16]
        fields.append((name, offset, length))
        offset += length
        position += 32
    for index in range(count):
        row = data[header_length + index * record_length : header_length + (index + 1) * record_length]
        yield {name: row[start : start + length].decode().strip() for name, start, length in fields}


def shapes_from_shp(data):
    position = 100
    while position < len(data):
        _, length = struct.unpack_from(">II", data, position)
        position += 8
        record = memoryview(data)[position : position + length * 2]
        position += length * 2
        shape_type = struct.unpack_from("<I", record, 0)[0]
        if shape_type != 5:
            yield []
            continue
        part_count, point_count = struct.unpack_from("<II", record, 36)
        parts = list(struct.unpack_from(f"<{part_count}I", record, 44)) + [point_count]
        points_start = 44 + part_count * 4
        points = [struct.unpack_from("<dd", record, points_start + index * 16) for index in range(point_count)]
        yield [points[parts[index] : parts[index + 1]] for index in range(part_count)]


def project(lon, lat, region):
    if region == "Alaska":
        if lon > 0:
            lon -= 360
        return lon * math.cos(math.radians(61)), -lat
    if region == "Hawaii":
        return lon * math.cos(math.radians(20)), -lat
    phi, lam = math.radians(lat), math.radians(lon)
    phi1, phi2, phi0, lam0 = map(math.radians, (29.5, 45.5, 37.5, -96))
    n = (math.sin(phi1) + math.sin(phi2)) / 2
    c = math.cos(phi1) ** 2 + 2 * n * math.sin(phi1)
    rho = math.sqrt(c - 2 * n * math.sin(phi)) / n
    rho0 = math.sqrt(c - 2 * n * math.sin(phi0)) / n
    return rho * math.sin(n * (lam - lam0)), rho * math.cos(n * (lam - lam0)) - rho0


def perpendicular(point, start, end):
    dx, dy = end[0] - start[0], end[1] - start[1]
    if dx == dy == 0:
        return math.dist(point, start)
    return abs(dx * (start[1] - point[1]) - (start[0] - point[0]) * dy) / math.hypot(dx, dy)


def simplify(points, tolerance=0.42):
    if len(points) < 3:
        return points
    start, end = points[0], points[-1]
    distances = [perpendicular(point, start, end) for point in points[1:-1]]
    if not distances or max(distances) <= tolerance:
        return [start, end]
    pivot = distances.index(max(distances)) + 1
    return simplify(points[: pivot + 1], tolerance)[:-1] + simplify(points[pivot:], tolerance)


def main():
    archive = Path(sys.argv[1])
    with zipfile.ZipFile(archive) as zipped:
        dbf = next(name for name in zipped.namelist() if name.endswith(".dbf"))
        shp = next(name for name in zipped.namelist() if name.endswith(".shp"))
        items = list(zip(records_from_dbf(zipped.read(dbf)), shapes_from_shp(zipped.read(shp))))

    items = [(fields, rings) for fields, rings in items if fields["STUSPS"] not in {"PR", "VI", "GU", "MP", "AS"}]
    # The Hawaii inset shows the main islands at a readable size.
    items = [(fields, [ring for ring in rings if sum(point[0] for point in ring) / len(ring) > -161.1] if fields["NAME"] == "Hawaii" else rings) for fields, rings in items]
    regions = {}
    for fields, rings in items:
        region = fields["NAME"] if fields["NAME"] in {"Alaska", "Hawaii"} else "Contiguous"
        regions.setdefault(region, [])
        regions[region].extend(project(lon, lat, region) for ring in rings for lon, lat in ring)

    boxes = {"Contiguous": (26, 20, 948, 405), "Alaska": (30, 438, 245, 100), "Hawaii": (335, 462, 190, 57)}
    transforms = {}
    for region, points in regions.items():
        x0, y0, width, height = boxes[region]
        low_x, high_x = min(p[0] for p in points), max(p[0] for p in points)
        low_y, high_y = min(p[1] for p in points), max(p[1] for p in points)
        scale = min(width / (high_x - low_x), height / (high_y - low_y))
        margin_x = (width - scale * (high_x - low_x)) / 2
        margin_y = (height - scale * (high_y - low_y)) / 2
        transforms[region] = lambda point, lx=low_x, ly=low_y, s=scale, mx=x0 + margin_x, my=y0 + margin_y: (mx + s * (point[0] - lx), my + s * (point[1] - ly))

    output = [
        "/* Generated from the US Census Bureau's 2024 1:500,000 state boundaries. */",
        "export interface UsStatePath { name: string; code: string; region: string; path: string }",
        "export const usStatePaths: UsStatePath[] = [",
    ]
    for fields, rings in sorted(items, key=lambda item: item[0]["NAME"]):
        region = fields["NAME"] if fields["NAME"] in {"Alaska", "Hawaii"} else "Contiguous"
        transform = transforms[region]
        parts = []
        for ring in rings:
            points = [transform(project(lon, lat, region)) for lon, lat in ring]
            points = simplify(points)
            if len(points) < 3:
                continue
            parts.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in points) + "Z")
        path = "".join(parts)
        output.append(f"  {{ name: {fields['NAME']!r}, code: {fields['STUSPS']!r}, region: {region!r}, path: {path!r} }},")
    output.append("];")
    OUTPUT.write_text("\n".join(output) + "\n")
    print(f"Wrote {OUTPUT}, {OUTPUT.stat().st_size:,} bytes, {len(items)} states and DC")


if __name__ == "__main__":
    main()
