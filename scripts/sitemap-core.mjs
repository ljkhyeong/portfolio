const escapeXml = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;")

export const createSitemapXml = ({ routeMeta, toCanonicalUrl }) => {
    const urls = Object.entries(routeMeta)
        .filter(([, meta]) => !meta.noindex)
        .map(([pathname]) => `    <url><loc>${escapeXml(toCanonicalUrl(pathname))}</loc></url>`)

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        "</urlset>",
        "",
    ].join("\n")
}
