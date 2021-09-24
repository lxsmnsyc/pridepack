declare module 'tasuku' {
  interface TaskContext {
    setTitle: (title: string) => void,
    setStatus: (status: string) => void,
    setOutput: (error: string | { message: string }) => void,
    setWarning: (warning: Error | string) => void,
    setError: (error: Error | string) => void,
    task: Task;
  }

  interface TaskInstance<T> {
    result: T;
    clear(): void;
  }

  type Task = <T>(
    title: string,
    handler: (instance: TaskContext) => Promise<T>,
  ) => Promise<TaskInstance<T>>;

  const task: Task;

  export default task;
}
