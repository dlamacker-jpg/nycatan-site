// Serves the built React app on Railway. Railway sets PORT.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const app = express();

app.get('/healthz', (_req, res) => res.send('ok'));
// Results files change after every event, so don't let browsers cache them for long.
app.use('/data', express.static(path.join(dist, 'data'), { maxAge: '5m' }));
app.use('/assets', express.static(path.join(dist, 'assets'), { maxAge: '1y', immutable: true }));
app.use(express.static(dist, { index: false }));
// Client-side routes (/season, /players/x, ...) all get index.html.
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`NYCatan site on :${port}`));
