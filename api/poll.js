export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_TOKEN) return res.status(500).json({ error: 'REPLICATE_API_TOKEN not set' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing prediction id' });

  try {
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` }
    });
    const prediction = await pollRes.json();
    return res.status(200).json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
