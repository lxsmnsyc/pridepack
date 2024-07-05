import degit from 'degit';
import path from 'node:path';

const SOURCE = 'github:lxsmnsyc/pridepack';

export default async function copyFromTemplate(
  template: string,
  directory: string,
): Promise<void> {
  const target = path.resolve(process.cwd(), directory);
  const emitter = degit(`${SOURCE}/templates/${template}`);
  await emitter.clone(target);
}
