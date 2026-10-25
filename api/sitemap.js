const backendUrl = 'https://nourbackend.vercel.app/sitemap.xml';
const frontendUrl = 'https://nawartyshop.vercel.app';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      console.error(`Sitemap backend request failed with status ${response.status}`);
      return res.status(502).send('Unable to retrieve sitemap');
    }

    const sitemap = (await response.text()).replaceAll(
      'https://nourbackend.vercel.app',
      frontendUrl
    );
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap backend request failed', error);
    return res.status(502).send('Unable to retrieve sitemap');
  }
}
