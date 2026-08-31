const { Redis } = require('@upstash/redis');

const APP_TOKEN = 'lc-token-2020-9f3d1a';

let _kv = null;
function getClient() {
  if (_kv) return _kv;

  // Different Marketplace Redis providers (and the legacy Vercel KV) name
  // their env vars differently -- check all the common possibilities.
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_TOKEN;

  if (!url || !token) {
    const seen = Object.keys(process.env).filter((k) => /REDIS|KV_/i.test(k));
    const err = new Error(
      'Pa jwenn varyab koneksyon baz done a nan anviwonman Vercel la. ' +
      (seen.length
        ? `Varyab ki gen rapò ak Redis/KV mwen jwenn: ${seen.join(', ')}.`
        : 'Mwen pa jwenn okenn varyab ki gen rapò ak Redis/KV — verifye baz done a byen konekte ak pwojè sa a nan Vercel, epi ke ou fin REDEPLWAYE apre koneksyon an.')
    );
    throw err;
  }

  _kv = new Redis({ url, token });
  return _kv;
}

const CATEGORY_IDS = [
  "entree_stock",
  "fiche_debarquement",
  "marchandises_retournees",
  "factures_finis",
  "enregistrement_factures",
  "marchandises_avariees",
  "rapport_journalier",
  "rapport_livraison",
  "livraison_journaliere"
];

function keyFor(category) {
  return `entries:${category}`;
}

module.exports = async (req, res) => {
  try {
    if (req.query && req.query.diag === '1') {
      const relevant = Object.keys(process.env)
        .filter((k) => /REDIS|KV_/i.test(k))
        .reduce((acc, k) => {
          acc[k] = process.env[k] ? '(gen valè)' : '(vid)';
          return acc;
        }, {});
      return res.status(200).json({
        varyab_yo_jwenn: relevant,
        nòt: 'Sa a se yon lis non varyab sèlman — pa gen okenn valè sekrè ki montre.'
      });
    }

    const kv = getClient();

    // Every request except the diagnostic one must carry the token issued
    // by /api/auth after a correct password.
    const token = req.headers['x-app-token'];
    if (token !== APP_TOKEN) {
      return res.status(401).json({ error: 'Ou pa otorize. Antre modpas la ankò.' });
    }

    if (req.method === 'GET') {
      const { category } = req.query;

      if (category) {
        if (!CATEGORY_IDS.includes(category)) {
          return res.status(400).json({ error: 'Kategori envalid' });
        }
        const list = (await kv.get(keyFor(category))) || [];
        return res.status(200).json(list);
      }

      // No category given -> return everything grouped by category (used for the home page)
      const all = {};
      await Promise.all(
        CATEGORY_IDS.map(async (id) => {
          all[id] = (await kv.get(keyFor(id))) || [];
        })
      );
      return res.status(200).json(all);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { category, data } = body;

      if (!category || !CATEGORY_IDS.includes(category)) {
        return res.status(400).json({ error: 'Kategori envalid' });
      }

      const list = (await kv.get(keyFor(category))) || [];
      const entry = {
        _id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
        ...data
      };
      list.push(entry);
      await kv.set(keyFor(category), list);
      return res.status(200).json(entry);
    }

    if (req.method === 'DELETE') {
      const { category, id } = req.query;
      if (!category || !id || !CATEGORY_IDS.includes(category)) {
        return res.status(400).json({ error: 'Paramèt manke oswa envalid' });
      }
      const list = (await kv.get(keyFor(category))) || [];
      const filtered = list.filter((e) => e._id !== id);
      await kv.set(keyFor(category), filtered);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: 'Metòd pa sipòte' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erè sèvè' });
  }
};
