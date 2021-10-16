import { createInterface } from 'readline';

if (process.platform === 'win32') {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT', 'SIGINT');
  });
}

process.on('SIGINT', () => {
  process.exit();
});
