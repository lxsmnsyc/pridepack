export interface TaskStatus {
  failure: string;
  success: string;
  pending: string;
}

export interface TaskSetting {
  silent?: boolean;
  onStop?: () => void;
}

export interface Task<T> {
  start(): Promise<T>;
  stop(): void;
}

export default async function runTask<T>(
  callback: (prelog: () => void) => Promise<T>,
  status: TaskStatus,
  setting?: TaskSetting,
): Promise<Task<T>> {
  if (setting?.silent) {
    return {
      async start(): Promise<Awaited<T>> {
        const result = await callback(() => {
          // no-op
        });
        return result;
      },
      stop(): void {
        setting?.onStop?.();
      },
    };
  }
  const ora = (await import('ora')).default;
  const task = ora({
    spinner: 'aesthetic' as any,
  });

  return {
    async start(): Promise<T> {
      task.start(status.pending);
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
    },
    stop(): void {
      setting?.onStop?.();
      task.stop();
    },
  };
}
