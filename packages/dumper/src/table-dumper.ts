import { Knex } from 'knex';
import { stringify } from 'csv/sync';
import * as fs from 'fs';
import * as path from 'path';
import Listr from 'listr';
import { Dumper } from './dumper';
import {
  ChildTableConfig,
  ChildTableConfigSchema,
  RootTableConfig,
  RootTableConfigSchema,
} from './models/config';

export class TableDumper extends Listr {
  qb!: Knex.QueryBuilder;
  data!: any[];

  constructor(
    private dumper: Dumper,
    private client: Knex,
    private table: RootTableConfig | ChildTableConfig,
    private ids?: any[]
  ) {
    super([
      {
        title: `Generate query builder`,
        task: () => this.generateQueryBuilder(),
      },
      {
        title: `Querying data`,
        task: () => this.queryData(),
      },
      {
        title: `Dumping related tables`,
        skip: () => !this.table.relations,
        task: () => this.dumpRelations(),
      },
      {
        title: `Export data to CSV`,
        task: () => this.exportData(),
      },
    ]);

    if (!ids) {
      RootTableConfigSchema.validate(table);
    } else {
      ChildTableConfigSchema.validate(table);
    }
  }

  dumpRelations() {
    if (!this.table.relations) return;

    const listr = new Listr([], { concurrent: true });

    for (const relation of this.table.relations) {
      listr.add({
        title: `Dumping ${relation.name}`,
        task: () =>
          new TableDumper(
            this.dumper,
            this.client,
            relation,
            this.data.map((row) => row[relation.from])
          ),
      });
    }

    return listr;
  }

  async generateQueryBuilder() {
    const table = this.table;

    const qb = this.client.from({ s: table.name });

    if ('subset' in table && table.subset) {
      qb.limit(table.subset.limit);

      if (table.subset.order) {
        qb.orderBy(table.subset.order.column, table.subset.order.order);
      }
    }

    /**
     * If there is a parent table, we add an inner join to only get rows with relations.
     */
    if (this.ids && 'from' in table && 'to' in table) {
      qb.select(`s.*`) // We only want columns from this table (not the parent)
        .whereIn(`s.${table.to}`, this.ids);
    }

    this.qb = qb;
  }

  async queryData() {
    const data = await this.qb.then();
    this.data = data;
  }

  async exportData() {
    const output = stringify(this.data, { header: true });

    fs.writeFileSync(
      path.join(this.dumper.config.outputDirectory, `${this.table.name}.csv`),
      output
    );
  }
}
