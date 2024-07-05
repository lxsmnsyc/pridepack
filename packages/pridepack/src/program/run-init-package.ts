import licenses from '@ovyerus/licenses';
import prompts from 'prompts';
import patchPackage from '../core/patch-package';
import crash from './graceful-crash';

export default async function runInitPackage(
  name: string,
  directory?: string,
): Promise<void> {
  const { description } = await prompts({
    type: 'text',
    name: 'description',
    message: "Your package's description?",
    onState: crash,
  });
  const { author } = await prompts({
    type: 'text',
    name: 'author',
    message: 'Author name?',
    onState: crash,
  });
  const { repository } = await prompts({
    type: 'text',
    name: 'repository',
    message: 'Repository URL?',
    onState: crash,
  });
  const { homepage } = await prompts({
    type: 'text',
    name: 'homepage',
    message: 'Home URL?',
    onState: crash,
  });
  const { issues } = await prompts({
    type: 'text',
    name: 'issues',
    message: 'Issues URL?',
    onState: crash,
  });
  let license: string | undefined;

  const { licensed } = await prompts({
    type: 'confirm',
    name: 'licensed',
    message: 'Licensed?',
    onState: crash,
  });

  if (licensed) {
    license = (
      await prompts({
        type: 'autocomplete',
        name: 'license',
        message: 'Which license?',
        choices: Object.keys(licenses).map(item => ({
          title: item,
          value: item,
        })),
        onState: crash,
      })
    ).license;
  }

  const { private: isPrivate } = await prompts({
    type: 'confirm',
    name: 'private',
    message: 'Is your package private?',
    onState: crash,
  });
  await patchPackage(
    {
      name,
      license,
      author,
      description,
      isPrivate,
      repository,
      homepage,
      issues,
    },
    directory,
  );
}
