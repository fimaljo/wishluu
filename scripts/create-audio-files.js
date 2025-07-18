const fs = require('fs');
const path = require('path');

// Create a simple audio file with a beep sound
function createBeepAudio(duration = 2) {
  // This is a simple approach to create a basic audio file
  // In a real implementation, you'd want to use proper audio libraries

  const sampleRate = 44100;
  const frequency = 440; // A4 note
  const samples = duration * sampleRate;

  // Create a simple sine wave
  const audioData = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    audioData[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.3;
  }

  // Convert to 16-bit PCM
  const pcmData = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    pcmData[i] = Math.round(audioData[i] * 32767);
  }

  return Buffer.from(pcmData.buffer);
}

// Create different audio files for different moods
const audioFiles = [
  { name: 'birthday-song', duration: 2.5, frequency: 523 }, // C5
  { name: 'romantic-piano', duration: 3.2, frequency: 440 }, // A4
  { name: 'celebration', duration: 2.8, frequency: 659 }, // E5
  { name: 'peaceful', duration: 4.2, frequency: 330 }, // E4
  { name: 'upbeat', duration: 2.1, frequency: 587 }, // D5
];

// Ensure audio directory exists
const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Create audio files
audioFiles.forEach(({ name, duration, frequency }) => {
  const audioData = createBeepAudio(duration);
  const filePath = path.join(audioDir, `${name}.mp3`);

  // For now, we'll create a simple text file as a placeholder
  // In a real implementation, you'd want to create actual MP3 files
  const placeholderContent = `# Placeholder for ${name}.mp3
# Duration: ${duration}s
# Frequency: ${frequency}Hz
# This is a placeholder file. Replace with actual audio content.
`;

  fs.writeFileSync(filePath.replace('.mp3', '.txt'), placeholderContent);
  console.log(`Created placeholder for ${name}.mp3`);
});

console.log('\nAudio file placeholders created!');
console.log('Note: These are placeholder files. In a real implementation,');
console.log('you would need to replace them with actual MP3 audio files.');
