require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── PIN verification ─────────────────────────────────────────

app.post('/api/verify-pin', (req, res) => {
  const pinStr = String(req.body.pin || '').trim();

  const lists = {
    vendas:   (process.env.VENDAS_PINS || '').split(',').map(s => s.trim()).filter(Boolean),
    producao: (process.env.PROD_PINS   || '').split(',').map(s => s.trim()).filter(Boolean),
    resumo:   (process.env.RESUMO_PINS || '').split(',').map(s => s.trim()).filter(Boolean),
  };

  const anyConfigured = Object.values(lists).some(l => l.length > 0);
  if (!anyConfigured) return res.json({ ok: true, role: 'vendas' }); // dev mode — open

  for (const [role, pins] of Object.entries(lists)) {
    if (pins.includes(pinStr)) return res.json({ ok: true, role });
  }

  res.json({ ok: false });
});

// ─── Data submission ──────────────────────────────────────────

app.post('/api/submit', async (req, res) => {
  const data = req.body;
  const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.log(`[Mock] tipo=${data.reportType} | turno=${data.shift} | ${new Date().toLocaleTimeString('pt-PT')}`);
    return res.json({ success: true, mode: 'mock' });
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); }
    catch { result = { success: true }; }
    res.json(result);
  } catch (err) {
    console.error('Erro Google Sheets:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Export for Vercel ────────────────────────────────────────

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('');
    console.log('  🥖  Padaria Contentor Amarelo — Controlo de Stock');
    console.log(`  ✅  http://localhost:${PORT}`);
    console.log(`  📡  Google Sheets: ${process.env.GOOGLE_APPS_SCRIPT_URL ? 'Ligado ✓' : 'Modo mock (defina GOOGLE_APPS_SCRIPT_URL para ligar)'}`);
    const pinsConfigured = process.env.VENDAS_PINS || process.env.PROD_PINS || process.env.RESUMO_PINS;
    console.log(`  🔒  PINs: ${pinsConfigured ? 'Configurados ✓' : 'Sem PIN (acesso livre)'}`);
    console.log('');
  });
}
