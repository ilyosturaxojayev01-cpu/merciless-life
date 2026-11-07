import { GoogleGenAI, Modality } from '@google/genai';

const b64 = (buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/**
 * Gemini Live ulanishi: mikrofon + kamera -> Gemini; Gemini ovozi -> karnay.
 * Ovoz matnga aylantirilishi (input/output transcription) Gemini tomonidan bajariladi.
 */
export async function startLive({ session, stream, videoEl, onEntry, onPartial, onLevel, onStatus, onClose }) {
  const ai = new GoogleGenAI({ apiKey: session.token, httpOptions: { apiVersion: 'v1alpha' } });
  const outCtx = new AudioContext({ sampleRate: 24000 });
  const inCtx = new AudioContext({ sampleRate: 16000 });
  const analyser = outCtx.createAnalyser(); analyser.fftSize = 512; analyser.connect(outCtx.destination);
  const sources = new Set(); let nextTime = 0;
  let muted = false, camOn = true, closed = false;
  let pending = { role: null, text: '' };

  const flush = () => {
    const t = pending.text.trim();
    if (t) onEntry({ role: pending.role, text: t, at: new Date().toISOString() });
    pending = { role: null, text: '' }; onPartial(null);
  };
  const push = (role, text) => {
    if (pending.role && pending.role !== role) flush();
    pending.role = role; pending.text += text; onPartial({ role, text: pending.text.trim() });
  };

  const playChunk = (b) => {
    const i16 = new Int16Array(unb64(b).buffer);
    const f32 = Float32Array.from(i16, (v) => v / 32768);
    const buf = outCtx.createBuffer(1, f32.length, 24000); buf.copyToChannel(f32, 0);
    const src = outCtx.createBufferSource(); src.buffer = buf; src.connect(analyser);
    nextTime = Math.max(nextTime, outCtx.currentTime + 0.02);
    src.start(nextTime); nextTime += buf.duration;
    sources.add(src); src.onended = () => sources.delete(src);
  };

  const live = await ai.live.connect({
    model: session.model,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: session.systemInstruction,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
    },
    callbacks: {
      onopen: () => onStatus('live'),
      onmessage: (m) => {
        const sc = m.serverContent;
        if (!sc) return;
        sc.modelTurn?.parts?.forEach((p) => p.inlineData?.data && playChunk(p.inlineData.data));
        if (sc.inputTranscription?.text) push('user', sc.inputTranscription.text);
        if (sc.outputTranscription?.text) push('ai', sc.outputTranscription.text);
        if (sc.interrupted) { sources.forEach((s) => { try { s.stop(); } catch {} }); sources.clear(); nextTime = 0; }
        if (sc.turnComplete) flush();
      },
      onerror: () => onStatus('error'),
      onclose: () => { if (!closed) onClose?.(); },
    },
  });

  // Mikrofon (16 kHz PCM)
  await inCtx.audioWorklet.addModule('/pcm-worklet.js');
  const mic = inCtx.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
  const node = new AudioWorkletNode(inCtx, 'pcm-capture');
  node.port.onmessage = (e) => {
    if (muted || closed) return;
    live.sendRealtimeInput({ audio: { data: b64(e.data), mimeType: 'audio/pcm;rate=16000' } });
  };
  mic.connect(node);

  // Kamera (1 kadr/soniya, JPEG)
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 384;
  const g = canvas.getContext('2d');
  const frameTimer = setInterval(() => {
    if (!camOn || closed || !videoEl.videoWidth) return;
    g.drawImage(videoEl, 0, 0, 512, 384);
    live.sendRealtimeInput({ video: { data: canvas.toDataURL('image/jpeg', 0.6).split(',')[1], mimeType: 'image/jpeg' } });
  }, 1000);

  // AI ovozi balandligi -> lablar animatsiyasi
  const data = new Uint8Array(analyser.fftSize);
  let raf;
  const tick = () => {
    analyser.getByteTimeDomainData(data);
    let sum = 0; for (const v of data) sum += ((v - 128) / 128) ** 2;
    onLevel(Math.min(1, Math.sqrt(sum / data.length) * 3));
    raf = requestAnimationFrame(tick);
  };
  tick();

  live.sendRealtimeInput({ text: 'Suhbatni boshlang: salomlashing va birinchi savolni bering.' });

  return {
    setMuted: (v) => { muted = v; },
    setCam: (v) => { camOn = v; },
    stop() {
      closed = true; flush(); clearInterval(frameTimer); cancelAnimationFrame(raf);
      try { live.close(); } catch {}
      node.disconnect(); mic.disconnect(); inCtx.close(); outCtx.close();
    },
  };
}
