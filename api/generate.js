export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_TOKEN) return res.status(500).json({ error: 'REPLICATE_API_TOKEN not set' });

  const { prompt, negative_prompt, qr_code_content, qr_image_base64, model, controlnet_conditioning_scale, guidance_scale, num_inference_steps, seed } = req.body;

  try {
    let version, input;

    if (model === 'illusion') {
      version = '285001c0d735638589c9f4e1c1486a4b86ef2e41f7f77c4c46245f36d946abd8';
      input = {
        prompt: prompt || 'a beautiful fantasy landscape',
        negative_prompt: negative_prompt || 'ugly, disfigured, low quality, blurry',
        image: qr_image_base64 ? `data:image/png;base64,${qr_image_base64}` : undefined,
        qr_code_content: qr_code_content || undefined,
        num_inference_steps: num_inference_steps || 40,
        guidance_scale: guidance_scale || 7.5,
        controlnet_conditioning_scale: controlnet_conditioning_scale || 1.3,
        seed: seed || -1,
        width: 768,
        height: 768
      };
    } else {
      version = '628e604e13cf63d8ec58bd4d238571e8a50fd4571748571ec1cb49ddbb260095';
      input = {
        url: qr_code_content || 'https://unisec.dev',
        prompt: prompt || 'a beautiful fantasy landscape',
        negative_prompt: negative_prompt || 'ugly, disfigured, low quality, blurry, nsfw',
        num_inference_steps: num_inference_steps || 30,
        guidance_scale: guidance_scale || 7.5,
        controlnet_conditioning_scale: controlnet_conditioning_scale || 1.5,
        qr_conditioning_scale: controlnet_conditioning_scale || 1.5,
        seed: seed || -1
      };
    }

    Object.keys(input).forEach(k => input[k] === undefined && delete input[k]);

    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({ version, input })
    });

    const prediction = await createRes.json();

    if (prediction.status === 'succeeded') {
      return res.status(200).json({ status: 'succeeded', output: prediction.output });
    }
    if (prediction.status === 'failed') {
      return res.status(500).json({ status: 'failed', error: prediction.error });
    }

    return res.status(202).json({ status: prediction.status, id: prediction.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
