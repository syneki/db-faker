import Listr from 'listr';
import { Config, ConfigSchema } from './models/config';
import { TableAnonymizer } from './table-anonymizer';
import { ExistingFakeData } from './types/existing-fake-data';

export class Anonymizer extends Listr {
  existing: ExistingFakeData = {};
  config!: Config;

  constructor(config: Config) {
    super([]);

    this.config = ConfigSchema.validateSync(config);

    for (const file of this.config.files) {
      this.add({
        title: `Anonymizing table ${file}`,
        task: () => new TableAnonymizer(this, file),
      });
    }
  }
}
