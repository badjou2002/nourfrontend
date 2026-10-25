const backendUrl = 'https://nourbackend.vercel.app/robots.txt';
const frontendUrl = 'https://nawartyshop.vercel.app';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      console.error(`Robots backend request failed with status ${response.status}`);
      return res.status(502).send('Unable to retrieve robots.txt');
    }

    const robots = (await response.text()).replaceAll(
      'https://nourbackend.vercel.app',
      frontendUrl
    );
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(robots);
  } catch (error) {
    console.error('Robots backend request failed', error);
    return res.status(502).send('Unable to retrieve robots.txt');
  }
}
