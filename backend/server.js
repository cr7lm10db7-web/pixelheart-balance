"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();

// CORS Config
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const UPLOAD_DIR = path_1.default.join(__dirname, 'uploads');
const DATA_FILE = path_1.default.join(__dirname, 'data.json');
// Ensure directories and files exist
if (!fs_1.default.existsSync(UPLOAD_DIR))
    fs_1.default.mkdirSync(UPLOAD_DIR);
if (!fs_1.default.existsSync(DATA_FILE)) {
    fs_1.default.writeFileSync(DATA_FILE, JSON.stringify({ moments: [], profiles: { left: { name: 'Alex', imageUrl: null }, right: { name: 'Maria', imageUrl: null } } }));
}
// Multer Config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
app.use('/uploads', express_1.default.static(UPLOAD_DIR));
const readData = () => JSON.parse(fs_1.default.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
app.delete('/api/moments/:id', (req, res) => {
    const data = readData();
    data.moments = data.moments.filter((m) => m.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});
app.post('/api/upload/:side', upload.single('image'), (req, res) => {
    const data = readData();
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file?.filename}`;
    data.profiles[req.params.side].imageUrl = imageUrl;
    writeData(data);
    res.json({ imageUrl });
});
app.post('/api/profiles/:side', (req, res) => {
    const data = readData();
    data.profiles[req.params.side].name = req.body.name;
    writeData(data);
    res.json({ success: true });
});
app.post('/api/reset', (req, res) => {
    const data = readData();
    data.moments = [];
    writeData(data);
    res.json({ success: true });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
