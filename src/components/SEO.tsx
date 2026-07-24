import { site } from "../data/site";

interface Props {
  title: string;
  description?: string;
  path?: string;
}

/** React 19 hoists <title>/<meta> to <head> automatically. */
export default function SEO({ title, description = site.description, path = "" }: Props) {
  const fullTitle = title === site.name ? site.name : `${title} — ${site.name}`;
  const url = `${site.url}${path}`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
