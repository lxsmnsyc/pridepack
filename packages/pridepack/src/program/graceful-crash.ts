process.on('SIGINT', () => {
  process.exit(1);
});

export default function crash(state: { aborted: boolean }): void {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(1);
    });
  }
}
