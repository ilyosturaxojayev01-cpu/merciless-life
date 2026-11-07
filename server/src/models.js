import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  nameLower: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
  phone: { type: String, sparse: true, unique: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

const codeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  purpose: { type: String, enum: ['register', 'login'] },
  hash: String,
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
});

const interviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  fieldId: String,
  fieldTitle: String,
  language: String,
  status: { type: String, enum: ['active', 'finished'], default: 'active' },
  startedAt: Date,
  endedAt: Date,
  dayKey: String, // YYYY-MM-DD, UTC+5
  durationSec: Number,
  transcript: [{ role: { type: String, enum: ['ai', 'user'] }, text: String, at: Date, _id: false }],
}, { timestamps: true });

export const User = model('User', userSchema);
export const Code = model('Code', codeSchema);
export const Interview = model('Interview', interviewSchema);
