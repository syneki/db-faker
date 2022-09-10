#!/usr/bin/env node

import { loadConfig } from '@db-faker/config-loader';
import { program } from 'commander';
import { Dumper } from './dumper';

program
  .name('dumper')
  .description('Subset easily your databases')
  .version('0.0.1');

program
  .command('dump')
  .option('-c, --config <configFile>', 'Path to the config file', 'config.yaml')
  .action((options) => {
    const config = loadConfig(options.config);
    const dumper = new Dumper(config.get('dumper'));
    dumper.run().then(() => process.exit());
  });

program.parse();
