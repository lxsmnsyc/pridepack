import { InitialOptions } from '@jest/types/build/Config';
import * as jest from 'jest';
import { Listr } from 'listr2';
import measureTask from '../utils/measure-task';
import readConfig from '../utils/read-config';

const DEFAULT_JEST_CONFIG: InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default function test(args: string[]): void {
  measureTask(new Listr([
    {
      title: 'Running tests',
      task: () => {
        // Swap environments
        process.env.NODE_ENV = 'test';
        // Read config
        const config = readConfig();
        // Merge config
        const currentConfig = {
          ...DEFAULT_JEST_CONFIG,
          ...config.jest,
        };
        // Map config to args
        return jest.run([
          ...args,
          '--config',
          JSON.stringify(currentConfig),
        ]);
      },
    },
  ]));
}
