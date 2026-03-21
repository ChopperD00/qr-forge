# QR Forge

AI-powered artistic QR code generator. Turns URLs into scannable works of art.

## How It Works

1. Enter a URL — generates a high error-correction QR code client-side
2. Choose a style preset or write a custom prompt
3. Sends QR code + prompt to Replicate API (ControlNet + Stable Diffusion)
4. Returns a stylized QR code that's still scannable

## Tech

- **Frontend**: Vanilla JS + CSS (Figma skin coming)
- **QR Generation**: Client-side via `qrcode.js` (error correction H / 30%)
- **AI Backend**: Replicate API — two models available
- **Hosting**: Vercel (serverless API route proxies Replicate)

## Models

| Model | Use Case |
|-------|----------|
| `zylim0702/qr_code_controlnet` | SD 2.1 ControlNet trained on 150K QR+art pairs |
| `andreasjansson/illusion` | Artistic pattern/spiral/QR generation |

## Style Presets

Cyberpunk, Anime, Fantasy, Steampunk, Ukiyo-e, Geometric, Brutalist, 1-Bit, NERV, Vaporwave

## Deploy

```bash
# Import repo in Vercel, then set env var:
REPLICATE_API_TOKEN=your_replicate_key_here
```

## Stack

```
QR FORGE
├── public/
│   └── index.html      — Full app (QR gen + UI + scan test)
├── api/
│   ├── generate.js     — Vercel serverless (Replicate proxy)
│   └── poll.js         — Async prediction polling
├── vercel.json         — Routing config
└── README.md
```

---

Secret Menu LLC · UNISEC
