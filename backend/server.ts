import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure directories and files exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    moments: [],
    profiles: {
      left: { name: 'Alex', imageUrl: null },
      right: { name: 'Maria', imageUrl: null }
    },
    wins: { boy: 0, girl: 0 },
    isDiceUsed: false
  }));
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
app.use('/uploads', express.static(UPLOAD_DIR));

const readData = () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  if (!data.wins) data.wins = { boy: 0, girl: 0 }; // Migration
  if (data.isDiceUsed === undefined) data.isDiceUsed = false; // Migration
  return data;
};
const writeData = (data: any) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API
app.get('/api/state', (req, res) => {
  res.json(readData());
});

app.post('/api/moments', (req, res) => {
  const data = readData();
  const newMoment = { ...req.body, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() };
  data.moments.push(newMoment);
  writeData(data);
  res.json(newMoment);
});

app.post('/api/wins/:side', (req, res) => {
  const data = readData();
  const side = req.params.side as 'boy' | 'girl';
  data.wins[side] = (data.wins[side] || 0) + 1;
  writeData(data);
  res.json({ wins: data.wins });
});

app.post('/api/dice-used', (req, res) => {
  const data = readData();
  data.isDiceUsed = true;
  writeData(data);
  res.json({ isDiceUsed: true });
});

app.delete('/api/moments/:id', (req, res) => {
  const data = readData();
  data.moments = data.moments.filter((m: any) => m.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.post('/api/upload/:side', upload.single('image'), (req, res) => {
  const data = readData();
  const imageUrl = `http://localhost:3001/uploads/${req.file?.filename}`;
  data.profiles[req.params.side as 'left' | 'right'].imageUrl = imageUrl;
  writeData(data);
  res.json({ imageUrl });
});

app.post('/api/profiles/:side', (req, res) => {
  const data = readData();
  data.profiles[req.params.side as 'left' | 'right'].name = req.body.name;
  writeData(data);
  res.json({ success: true });
});

app.post('/api/reset', (req, res) => {
  const data = readData();
  data.moments = [];
  writeData(data);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Backend server running on http://localhost:3001');
});
