import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';

const r = Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, name: u.name });

r.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ error: "Ism kamida 3 ta belgidan iborat bo'lsin" });
    if (!password || password.length < 8) return res.status(400).json({ error: "Parol kamida 8 ta belgidan iborat bo'lsin" });
    if (await User.findOne({ nameLower: name.trim().toLowerCase() })) return res.status(409).json({ error: 'Bunday foydalanuvchi allaqachon mavjud' });
    const user = await User.create({
      name: name.trim(), nameLower: name.trim().toLowerCase(), passwordHash: await bcrypt.hash(password, 12),
    });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server xatosi' }); }
});

r.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ nameLower: String(name || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash)))
      return res.status(401).json({ error: "Ism yoki parol noto'g'ri" });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server xatosi' }); }
});

export default r;
