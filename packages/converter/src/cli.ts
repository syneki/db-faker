#!/usr/bin/env node

import { loadConfig } from '@db-faker/config-loader';
import { program } from 'commander';
import { Converter } from './converter';

program.name('converter').description('Convert databases').version('0.0.1');

program
  .command('convert')
  .option('-c, --config <configFile>', 'Path to the config file', 'config.yaml')
  .option('-o, --output <outputPath>', 'Path to output directory')
  .action((options) => {
    const config = loadConfig(options.config);
    const converter = new Converter(config.get('converter'));
    converter.run().then(() => process.exit());
  });

program.parse();
