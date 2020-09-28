import fs from 'fs-extra';
import { Listr } from 'listr2';
import measureTask from '../utils/measure-task';
import readConfigWithCWD from '../utils/read-config-with-cwd';

export default function clean(): void {
  measureTask(new Listr([
    {
      title: 'Cleaning out directory',
      task: () => fs.remove(readConfigWithCWD().outDir),
    },
  ]));
}