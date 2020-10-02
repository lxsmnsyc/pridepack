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
  command: string
): string {
  const base = `${chalk.magenta('pridepack')} ${chalk.magentaBright(command)}`;

  return base + process.argv.slice(3).join(' ');
}