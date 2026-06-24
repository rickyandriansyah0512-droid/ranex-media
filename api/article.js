export default async function handler(req, res) {

  const slug = req.query.slug;

  if (!slug) {
    return res.status(404).send("Artikel tidak ditemukan");
  }

  const SUPABASE_URL =
    "https://incllqupwigchudjuhve.supabase.co";

  const SUPABASE_KEY =
    process.env.SUPABASE_ANON_KEY;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/articles?slug=eq.${slug}&status=eq.published&select=*`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const articles = await response.json();

  if (!articles.length) {
    return res.status(404).send("Artikel tidak ditemukan");
  }

  const article = articles[0];

  const title =
    article.title || "Ranex Media";

  const description =
    article.excerpt || "";

  const image =
    article.cover_url ||
    "https://media.ranexgroup.my.id/assets/logo-ranex-media.png";

  const url =
    `https://media.ranexgroup.my.id/article/${article.slug}`;

  res.setHeader("Content-Type", "text/html");

  res.send(`
<!DOCTYPE html>
<html>
<head>

<title>${title}</title>

<meta name="description" content="${description}">

<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:site_name" content="Ranex Media">
<meta property="og:locale" content="id_ID">

<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">

<meta http-equiv="refresh"
content="0; url=/detail.html?slug=${article.slug}">

</head>
<body>
Mengalihkan...
</body>
</html>
  `);

}
