export interface TaskStatus {
  failure: string;
  success: string;
  pending: string;
}

export default async function runTask<T>(
  callback: (prelog: () => void) => Promise<T>,
  status: TaskStatus,
): Promise<T> {
  const ora = (await import('ora')).default;
  const task = ora(status.pending).start();
  try {
    let called = false;
    const result = await callback(() => {
      if (!called) {
        called = true;
        task.succeed(status.success);
      }
    });
    if (!called) {
      task.succeed(status.success);
    }
    return result;
  } catch (error) {
    task.fail(status.failure);
    throw error;
  }
}
