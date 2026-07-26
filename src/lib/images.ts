export interface ResponsiveImageSource {
  src: string;
  width: number;
}

export function imageUrl(src: string) {
  return `${import.meta.env.BASE_URL}images/${src}`;
}

export function imageSrcSet(sources?: ResponsiveImageSource[]) {
  if (!sources?.length) return undefined;
  return sources.map(({ src, width }) => `${imageUrl(src)} ${width}w`).join(", ");
}
