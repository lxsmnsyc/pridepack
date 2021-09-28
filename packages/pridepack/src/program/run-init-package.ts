import prompts from 'prompts';
import licenses from '@ovyerus/licenses';
import patchPackage from '../core/patch-package';

export default async function runInitPackage(name: string, directory?: string): Promise<void> {
  const { description } = await prompts({
    type: 'text',
    name: 'description',
    message: 'Your package\'s description?',
  });
  const { author } = await prompts({
    type: 'text',
    name: 'author',
    message: 'Author name?',
  });
  const { repository } = await prompts({
    type: 'text',
    name: 'repository',
    message: 'Repository URL?',
  });
  const { homepage } = await prompts({
    type: 'text',
    name: 'homepage',
    message: 'Home URL?',
  });
  const { issues } = await prompts({
    type: 'text',
    name: 'issues',
    message: 'Issues URL?',
  });
  const { license } = await prompts({
    type: 'autocomplete',
    name: 'license',
    message: 'License?',
    choices: Object.keys(licenses).map((item) => ({
      title: item,
      value: item,
    })),
  });
  const { private: isPrivate } = await prompts({
    type: 'confirm',
    name: 'private',
    message: 'Is your package private?',
  });
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
