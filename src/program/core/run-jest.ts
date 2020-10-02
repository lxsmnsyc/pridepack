
import * as jest from 'jest';
import { InitialOptions } from '@jest/types/build/Config';
import readConfig from './read-config';

const DEFAULT_JEST_CONFIG: InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default function runJest(args: string[]): Promise<void> {
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
}