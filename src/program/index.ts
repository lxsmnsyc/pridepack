import renderProgram, { ProgramCommand } from './Program';

export default function runProgram(
  command: ProgramCommand,
  template?: string,
  packageName?: string,
): void {
  renderProgram(command, template, packageName);
}