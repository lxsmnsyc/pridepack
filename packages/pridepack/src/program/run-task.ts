import ora from 'ora';

export interface TaskStatus {
  failure: string;
  success: string;
  pending: string;
}

export default async function runTask<T>(
  callback: () => Promise<T>,
  status: TaskStatus,
): Promise<T> {
  const task = ora(status.pending).start();
  try {
    const result = await callback();
    task.succeed(status.success);
    return result;
  } catch (error) {
    task.fail(status.failure);
    throw error;
  }
}
