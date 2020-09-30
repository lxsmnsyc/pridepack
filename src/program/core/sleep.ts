
export default function sleep(time: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(resolve, time, true);
  });
}
