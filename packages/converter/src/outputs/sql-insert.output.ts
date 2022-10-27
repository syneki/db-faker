import knex, { Knex } from 'knex';
import { InputResult } from '../inputs/abstract-input';
import { AbstractOutput } from './abstract-output';
import fs from 'fs';
import path from 'path';

export class SqlInsertOutput extends AbstractOutput {
  async run(input: InputResult): Promise<void> {
    const res = [];

    for (const [table, data] of Object.entries(input)) {
      for (const row of data) {
        const keys = Object.keys(row).join(', ');
        const values = Object.values(row)
          .map((value: any) => {
            if (isNaN(value)) return `'${value.replace(/'/g, "''")}'`;
            else return value;
          })
          .join(', ');

        const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
        res.push(query);
      }
    }

    fs.writeFileSync(path.join(this.config.path, 'output.sql'), res.join('\n'));
  }
}
