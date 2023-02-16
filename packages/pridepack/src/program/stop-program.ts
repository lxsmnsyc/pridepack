import { cancel, isCancel } from '@clack/prompts';
import crash from './graceful-crash';

export default function stopProgram(value: unknown | symbol): value is symbol {
  if (isCancel(value)) {
    cancel('pridepack cancelled.');
    crash({ aborted: true });
    return true;
  }
  return false;
}
