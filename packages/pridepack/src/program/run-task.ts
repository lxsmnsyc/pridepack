import { cancel, spinner } from '@clack/prompts';

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

export default function runTask<T>(
  callback: (prelog: () => void) => Promise<T>,
  status: TaskStatus,
  setting?: TaskSetting,
): Task<T> {
  if (setting?.silent) {
    return {
      async start() {
        const result = await callback(() => {
          // no-op
        });
        return result;
      },
      stop() {
        setting?.onStop?.();
      },
    };
  }

  const task = spinner();

  return {
    async start() {
      task.start(status.pending);
      try {
        let called = false;
        const result = await callback(() => {
          if (!called) {
            called = true;
            task.stop(status.success);
          }
        });
        if (!called) {
          task.stop(status.success);
        }
        return result;
      } catch (error) {
        cancel(status.failure);
        throw error;
      }
    },
    stop() {
      setting?.onStop?.();
      task.stop();
    },
  };
}
