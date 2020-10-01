import chalk from 'chalk';

export function pendingMessage(
  verb: string,
  subject: string,
  suffix?: string,
): string {
  const base = `${verb} ${chalk.underline(subject)}`;
  if (suffix) {
    return `${base} ${suffix}...`;
  }
  return `${base}...`;
}

export function successMessage(
  verb: string,
  subject: string,
  suffix?: string,
): string {
  const base = `${verb} ${chalk.underline(subject)}`;
  if (suffix) {
    return `${base} ${suffix}.`;
  }
  return `${base}.`;
}

export function commandTitle(
  command: string,
  ...options: string[]
): string {
  const base = `${chalk.magenta('pridepack')} ${chalk.magentaBright(command)}`;

  return options.reduce(
    (acc, value) => (
      `${acc} ${chalk.cyan(value)}`
    ),
    base,
  );
}