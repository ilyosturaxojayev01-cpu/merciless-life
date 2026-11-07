# AI Interview Simulator

Kasb va tashkilotga kirish uchun AI bilan jonli video ish suhbati.
**Frontend:** React (Vite) · **Backend:** Node.js/Express + MongoDB · **AI:** Google Gemini Live API · **Vaqt:** UTC+5 (Asia/Tashkent)

## Ishga tushirish

Kerak: Node.js 18+, MongoDB (lokal yoki Atlas), Gemini API kaliti (https://aistudio.google.com/apikey).

```bash
# 1) Backend
cd server
cp .env.example .env      # GEMINI_API_KEY, MONGO_URI, JWT_SECRET ni to'ldiring
npm install
npm run dev               # http://localhost:5000

# 2) Frontend (yangi terminalda)
cd client
npm install
npm run dev               # http://localhost:5173
```

Kamera/mikrofon faqat `localhost` yoki HTTPS da ishlaydi.

## Email va SMS
- `SMTP_*` to'ldirilsa, ro'yxatdan o'tish va har bir kirishda emailga 6 xonali kod yuboriladi.
- Emaili yo'q foydalanuvchi telefon raqami bilan ro'yxatdan o'tadi, kod SMS orqali ketadi (`ESKIZ_*` — Eskiz.uz).
- Sozlanmagan bo'lsa kodlar server konsoliga chiqadi; `DEV_SHOW_CODE=true` bo'lsa ekranda ham ko'rinadi. **Productionda `DEV_SHOW_CODE=false` qiling.**

## Tuzilma
- `server/src/fields.js` — 20 ta kasb yo'nalishi, dress-kod turi va AI so'raydigan mavzular
- `server/src/routes/interviews.js` — AI uchun system prompt, Gemini vaqtinchalik tokeni, suhbat matnini saqlash
- `client/src/components/Avatar.jsx` — kasbga qarab kiyimi o'zgaradigan AI suhbatdosh (lab harakati ovozga bog'langan)
- `client/src/live.js` — Gemini Live: mikrofon (16 kHz PCM), kamera (1 kadr/s), ovoz → matn, AI ovozi
- `client/src/time.js` va `server/src/tz.js` — barcha vaqt UTC+5 da

## Muhim
- Gemini Live model nomi tez-tez yangilanadi. Ishlamasa `.env` dagi `GEMINI_LIVE_MODEL` ni https://ai.google.dev/gemini-api/docs/live dagi joriy nomga almashtiring.
- API kaliti brauzerga chiqmaydi: server bir martalik vaqtinchalik token beradi.
- Loyiha kod darajasida yozilgan, bu muhitda `npm install` va ishga tushirib sinash imkoni bo'lmadi. Birinchi ishga tushirishda kichik tuzatishlar kerak bo'lishi mumkin.
