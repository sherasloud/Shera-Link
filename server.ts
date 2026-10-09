import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for AI network operations & diagnostics
app.post('/api/ai-ops', async (req, res) => {
  try {
    const { prompt, telemetry, power, nodes } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the Lead Satellite Network Engineer for Shera Link, a rural village broadband system in Bangladesh/South Asia powered by a Starlink Gen 3 High-Performance dish, 5.8 GHz PtMP distribution towers, and an off-grid solar-battery microgrid.
Current telemetry context:
- Starlink Terminal: ${telemetry?.dishModel || 'Starlink Gen 3'} (Locked to ${telemetry?.satelliteId || 'STARLINK-31842'})
- Downlink: ${telemetry?.downlinkCurrentMbps || 234} Mbps, Uplink: ${telemetry?.uplinkCurrentMbps || 38} Mbps, Latency: ${telemetry?.pingMs || 27} ms, SNR: ${telemetry?.snrDb || 13.8} dB
- Solar: ${power?.solarGenerationWatts || 1940}W generation, Battery: ${power?.batterySocPercent || 88}% SOC (${power?.batteryRuntimeHours || 18.5} hours runtime)
- Nodes: 6 village sectors (School, Health Clinic, Haat Bazaar, Farmers Krishi Samity, Residential, Meghna River Boat Ghat).
Answer the operator's query concisely with practical, grounded engineering guidance. If asked in Bengali, answer in warm, clear Bengali. If asked in English, answer in clear English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    console.error('AI Ops API error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shera Link Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
