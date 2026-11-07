import './tz.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import interviews from './routes/interviews.js';
import { TZ, fmtDateTime } from './tz.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 80 }), auth);
app.use('/api', interviews);
app.get('/api/time', (_, res) => res.json({ now: new Date().toISOString(), tz: TZ, offset: '+05:00' }));

await mongoose.connect(process.env.MONGO_URI);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server: http://localhost:${port}  |  ${fmtDateTime()} (UTC+5)`));
