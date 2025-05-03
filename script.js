// Existing code ...

// Waveform Visualization
let audioContext, analyser, dataArray, bufferLength, audioElement;

function initWaveform() {
  if (audioContext) return;
  // Create audio element for the stream
  audioElement = new Audio('https://cutters-choice-radio.radiocult.fm/stream');
  audioElement.crossOrigin = 'anonymous';
  audioElement.loop = true;
  audioElement.play().catch(err => console.error('Audio play error:', err));

  // Set up Web Audio API
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audioElement);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Canvas setup
  const canvas = document.getElementById('waveform');
  const ctx = canvas.getContext('2d');
  const headerEl = document.querySelector('header');

  function resizeCanvas() {
    canvas.width = headerEl.clientWidth;
    canvas.height = headerEl.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Draw loop
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.stroke();
  }
  draw();
}

// Initialize waveform on first user interaction
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', initWaveform, { once: true });
});

// Existing initialization code ...