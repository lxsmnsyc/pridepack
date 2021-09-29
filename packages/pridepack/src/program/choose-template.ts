import prompts from 'prompts';

const TEMPLATES = [
  'basic',
  'react',
  'preact',
  'vue',
  'fastify',
  'bot-discord',
  'solid-js',
];

export default async function chooseTemplate(): Promise<{ template: string }> {
  return prompts({
    type: 'select',
    name: 'template',
    message: 'Choose your template',
    choices: TEMPLATES.map((item) => ({
      title: item,
      value: item,
    })),
    initial: 0,
  });
}
