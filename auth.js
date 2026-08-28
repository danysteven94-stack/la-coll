const APP_PASSWORD = '2020';
const APP_TOKEN = 'lc-token-2020-9f3d1a';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Metòd pa sipòte' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body && body.password === APP_PASSWORD) {
      return res.status(200).json({ ok: true, token: APP_TOKEN });
    }
    return res.status(401).json({ ok: false, error: 'Modpas la pa kòrèk.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erè sèvè' });
  }
};
