import * as knex from 'knex';
import * as fs from 'fs';
import { TableDumper } from './table-dumper';
import Listr from 'listr';
import { Config, ConfigSchema } from './models/config';

export class Dumper extends Listr {
  config: Config;
  client: knex.Knex;

  constructor(config: Config) {
    super([], { concurrent: true });

    this.config = ConfigSchema.validateSync(config);
    this.client = knex.knex(config.connection);

    if (!fs.existsSync(this.config.outputDirectory)) {
      fs.mkdirSync(this.config.outputDirectory);
    }

    for (const table of this.config.tables) {
      this.add({
        title: `Dumping ${table.name}`,
        task: () => new TableDumper(this, this.client, table),
      });
    }
  }
}
