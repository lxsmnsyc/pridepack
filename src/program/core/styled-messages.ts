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

  const args = process.argv.slice(3);

  if (args.length > 0) {
    return `${base} ${args.join(' ')}`;
  }

  return base;
}