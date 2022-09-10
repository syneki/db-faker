import { Dumper } from '@db-faker/dumper';
import Listr from 'listr';
import { Config, ConfigSchema } from './models/config';
import { Anonymizer } from '@db-faker/anonymizer';
import * as fs from 'fs';
import * as path from 'path';

export class DBFaker extends Listr {
  config: Config;
  dumper?: Dumper;
  anonymizer?: Anonymizer;

  constructor(config: Config) {
    super([
      {
        title: `Dumping your database`,
        task: () => this.runDumper(),
      },
      {
        title: `Anonymizing your data`,
        task: () => this.runAnonymizer(),
      },
    ]);

    this.config = ConfigSchema.validateSync(config);
  }

  runDumper(): Listr {
    this.dumper = new Dumper({
      connection: this.config.connection,
      tables: this.config.dumper.tables,
      outputDirectory: path.join(this.config.outputDirectory, 'dump'),
    });

    return this.dumper;
  }

  runAnonymizer(): Listr {
    const files = fs
      .readdirSync(path.join(this.config.outputDirectory, 'dump'))
      .filter((path) => path.match(/.+.csv$/));

    this.anonymizer = new Anonymizer({
      files,
      tables: this.config.anonymizer.tables,
      columns: this.config.anonymizer.columns,
      outputDirectory: path.join(this.config.outputDirectory, 'anonymized'),
    });

    return this.anonymizer;
  }
}
