import { Knex } from 'knex';
import { array, InferType, mixed, number, object, ref, string } from 'yup';

const TableSchema = object({
  name: string().required(),
  relations: array().optional(),
});

export const ChildTableConfigSchema = TableSchema.concat(
  object({
    from: string().required(),
    to: string().required(),
  })
);

export const RootTableConfigSchema = TableSchema.concat(
  object({
    subset: object({
      limit: number().required().default(1000),
      order: object({
        column: string().required().default('id'),
        order: string().default('desc'),
      }),
    }),
  })
);

export const ConfigSchema = object({
  tables: array().required(),
  outputDirectory: string().optional().default('tmp/output'),
  connection: mixed<Knex.Config>().required(),
});

export type ChildTableConfig = InferType<typeof ChildTableConfigSchema>;
export type RootTableConfig = InferType<typeof RootTableConfigSchema>;
export type Config = InferType<typeof ConfigSchema>;
