#!/usr/bin/env node

import { loadConfig } from '@db-faker/config-loader';
import { program } from 'commander';
import { DBFaker } from './db-faker';

program
  .name('db-faker')
  .description('Sample and anonymize your production databases')
  .version('0.0.1');

program
  .command('run')
  .option('-c, --config <configFile>', 'Path to the config file', 'config.yaml')
  .action((options) => {
    const config = loadConfig(options.config);
    const dbFaker = new DBFaker(config.config as any);

    dbFaker.run().then(() => process.exit());
  });

program.parse();
