import { select } from '@clack/prompts';

const TEMPLATES = [
  'basic',
  'react',
  'preact',
  'vue',
  'fastify',
  'bot-discord',
  'solid-js',
];

export default function chooseTemplate() {
  return select({
    message: 'Choose your template',
    options: TEMPLATES.map((item) => ({
      label: item,
      value: item,
    })),
  });
}
