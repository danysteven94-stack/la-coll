const ADMIN_PASSWORD = '2020';
const APP_TOKEN = 'lc-token-2020-9f3d1a';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Metòd pa sipòte' });
  }

  const token = req.headers['x-app-token'];
  if (token !== APP_TOKEN) {
    return res.status(401).json({ error: 'Ou pa otorize. Antre nan aplikasyon an anvan.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body && body.password === ADMIN_PASSWORD) {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false, error: 'Modpas admin la pa kòrèk.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erè sèvè' });
  }
};
