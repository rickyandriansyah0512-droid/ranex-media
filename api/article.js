module.exports = async function handler(req, res) {
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
article.excerpt ||
"Baca artikel lengkap dari Ranex Media.";

const image =
article.cover_url ||
"https://media.ranexgroup.my.id/assets/logo-ranex-media.png";

const author =
article.writer_name ||
"Redaksi Ranex";

const url =
`https://media.ranexgroup.my.id/article/${article.slug}`;

const schema = {
"@context": "https://schema.org",
"@type": "NewsArticle",
"headline": title,
"description": description,
"image": [image],

"datePublished": article.created_at,

"dateModified":
  article.updated_at ||
  article.created_at,

"author": {
  "@type": "Person",
  "name": author
},

"publisher": {
  "@type": "Organization",
  "name": "Ranex Media",
  "logo": {
    "@type": "ImageObject",
    "url":
      "https://media.ranexgroup.my.id/assets/logo-ranex-media.png"
  }
},

"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": url
}

};

res.setHeader(
"Content-Type",
"text/html; charset=UTF-8"
);

res.send(`

<!DOCTYPE html>

<html lang="id">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${title}</title>

<meta name="robots"
content="index,follow,max-image-preview:large">

<meta name="author"
content="${author}">

<meta name="description"
content="${description}">

<link rel="canonical"
href="${url}">

<meta property="og:type"
content="article">

<meta property="og:title"
content="${title}">

<meta property="og:description"
content="${description}">

<meta property="og:image"
content="${image}">

<meta property="og:url"
content="${url}">

<meta property="og:site_name"
content="Ranex Media">

<meta property="og:locale"
content="id_ID">

<meta property="og:image:width"
content="1200">

<meta property="og:image:height"
content="630">

<meta property="article:published_time"
content="${article.created_at}">

<meta property="article:modified_time"
content="${
 article.updated_at ||
 article.created_at
}">

<meta property="article:author"
content="${author}">

<meta name="twitter:card"
content="summary_large_image">

<meta name="twitter:title"
content="${title}">

<meta name="twitter:description"
content="${description}">

<meta name="twitter:image"
content="${image}">

<meta name="twitter:site"
content="@RanexMedia">

<meta name="twitter:creator"
content="@RanexMedia">

<script type="application/ld+json">
${JSON.stringify(schema)}
</script>

<meta http-equiv="refresh"
content="0; url=/detail.html?slug=${article.slug}">

</head>

<body>
Mengalihkan...
</body>

</html>
  `);
}
