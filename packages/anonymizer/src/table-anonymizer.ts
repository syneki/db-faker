import Listr from 'listr';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { stringify, parse } from 'csv/sync';
import { Anonymizer } from './anonymizer';
import { ExistingFakeData } from './types/existing-fake-data';
import { ColumnConfig, TableConfig } from './models/config';

export class TableAnonymizer extends Listr {
  data!: any[];

  existing: ExistingFakeData = {};

  constructor(private anonymizer: Anonymizer, private file: string) {
    super();

    this.add([
      {
        title: `Importing data`,
        task: () => this.importData(),
      },
      {
        title: `Anonymizing rows`,
        task: () => this.anonymizeRows(),
      },
      {
        title: `Exporting data`,
        task: () => this.exportData(),
      },
    ]);
  }

  importData() {
    const res = fs.readFileSync(this.file);
    this.data = parse(res, { columns: true });
  }

  fakeData(engine: string) {
    if (engine.match(/.+{{.+}}.+/)) return faker.helpers.fake(engine);
    return faker.helpers.fake(`{{${engine}}}`);
  }

  /**
   * Anonymizes a value of a row from a column config.
   *
   * If the row does not have the property we skip it silently.
   *
   * @param row
   * @param column
   * @returns If the value has been anonymized
   */
  anonymizeColumn(row: any, column: ColumnConfig, global: boolean): boolean {
    if (!row[column.name]) {
      return false;
    }

    /**
     * If this column config is global and their is already existing fake data for this initial value
     * we use it.
     */
    if (
      global &&
      this.anonymizer.existing[column.name] &&
      this.anonymizer.existing[column.name][row[column.name]]
    ) {
      row[column.name] =
        this.anonymizer.existing[column.name][row[column.name]];
      return true;
    }

    /**
     * If their is already existing fake data for this initial value
     * we use it.
     */
    if (
      this.existing[column.name] &&
      this.existing[column.name][row[column.name]]
    ) {
      row[column.name] = this.existing[column.name][row[column.name]];
      return true;
    }

    /**
     * If we didnt find any value, we create a new one.
     */
    const data = this.fakeData(column.engine);

    /**
     * If this is a global column config we store the fake data globally.
     */
    if (global) {
      if (!this.anonymizer.existing[column.name])
        this.anonymizer.existing[column.name] = {};
      this.anonymizer.existing[column.name][row[column.name]] = data;
    } else {
      if (!this.existing[column.name]) this.existing[column.name] = {};
      this.existing[column.name][row[column.name]] = data;
    }

    row[column.name] = data;

    return true;
  }

  anonymizeRows() {
    for (const row of this.data) {
      for (const column of this.anonymizer.config.columns ?? []) {
        this.anonymizeColumn(row, column, true);
      }

      if (this.config) {
        for (const column of this.config.columns) {
          this.anonymizeColumn(row, column, false);
        }
      }
    }
  }

  exportData() {
    const output = stringify(this.data, { header: true });

    if (!fs.existsSync(this.anonymizer.config.outputDirectory)) {
      fs.mkdirSync(this.anonymizer.config.outputDirectory);
    }

    fs.writeFileSync(
      path.join(
        this.anonymizer.config.outputDirectory,
        `${this.tableName}.csv`
      ),
      output
    );
  }

  public get config(): TableConfig | undefined {
    const tables = this.anonymizer.config.tables;
    if (!tables) return;

    return tables.find((table) => table.name === this.tableName);
  }

  public get tableName(): string {
    const a = this.file.split('/').pop();
    if (!a) throw new Error('File name invalid');

    const b = a.split('.')[0];
    if (!b) throw new Error('File name invalid');

    return b;
  }
}
