type SoundType = 'success' | 'error' | 'levelUp' | 'achievement' | 'click';

let audioCtx: AudioContext | null = null;
let enabled = true;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15
): void {
  if (!enabled) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function playSound(type: SoundType): void {
  if (!enabled) return;

  switch (type) {
    case 'success':
      playTone(523, 0.1);
      setTimeout(() => playTone(659, 0.1), 80);
      setTimeout(() => playTone(784, 0.15), 160);
      break;
    case 'error':
      playTone(200, 0.2, 'square', 0.08);
      setTimeout(() => playTone(150, 0.25, 'square', 0.08), 100);
      break;
    case 'levelUp':
      [523, 659, 784, 1047].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 100);
      });
      break;
    case 'achievement':
      [440, 554, 659, 880].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'triangle', 0.1), i * 80);
      });
      break;
    case 'click':
      playTone(800, 0.05, 'sine', 0.05);
      break;
  }
}

export function resumeAudio(): void {
  if (audioCtx?.state === 'suspended') {
    audioCtx.resume();
  }
}
