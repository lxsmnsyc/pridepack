import licenses from '@ovyerus/licenses';
import { text, confirm } from '@clack/prompts';
import patchPackage from '../core/patch-package';
import stopProgram from './stop-program';

export default async function runInitPackage(name: string, directory?: string): Promise<void> {
  const description = await text({
    message: 'Your package\'s description?',
    placeholder: 'This is an example description.',
  });
  if (stopProgram(description)) {
    return;
  }
  const author = await text({
    message: 'Author name?',
    placeholder: 'John Doe',
  });
  if (stopProgram(author)) {
    return;
  }
  const repository = await text({
    message: 'Repository URL?',
    initialValue: 'https://github.com/username/repo',
  });
  if (stopProgram(repository)) {
    return;
  }
  const homepage = await text({
    message: 'Home URL?',
    initialValue: 'https://github.com/username/repo',
  });
  if (stopProgram(homepage)) {
    return;
  }
  const issues = await text({
    message: 'Issues URL?',
    initialValue: 'https://github.com/username/repo/issues',
  });
  if (stopProgram(issues)) {
    return;
  }

  const licensed = await confirm({
    message: 'Licensed?',
  });
  if (stopProgram(licensed)) {
    return;
  }
  const license = licensed && await text({
    message: 'Which license?',
    initialValue: 'MIT',
    validate(value) {
      if (value in licenses) {
        return undefined;
      }
      return 'invalid license';
    },
  });
  if (!license || stopProgram(license)) {
    return;
  }

  const isPrivate = await confirm({
    message: 'Is your package private?',
  });
  if (stopProgram(isPrivate)) {
    return;
  }
  await patchPackage({
    name,
    license,
    author,
    description,
    isPrivate,
    repository,
    homepage,
    issues,
  }, directory);
}
