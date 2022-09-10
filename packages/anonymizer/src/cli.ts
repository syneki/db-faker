#!/usr/bin/env node

import { loadConfig } from '@db-faker/config-loader';
import { program } from 'commander';
import { Anonymizer } from './anonymizer';

program
  .name('anonymize')
  .description('Subset easily your databases')
  .version('0.0.1');

program
  .command('anonymize')
  .option('-c, --config <configFile>', 'Path to the config file', 'config.yaml')
  .option('-o, --output <outputPath>', 'Path to output directory')
  .action((options) => {
    const config = loadConfig(options.config);
    const anonymizer = new Anonymizer(config.get('anonymizer'));
    anonymizer.run().then(() => process.exit());
  });

program.parse();
