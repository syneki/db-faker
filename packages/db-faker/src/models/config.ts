import { Knex } from 'knex';
import { array, InferType, mixed, object, string } from 'yup';
import * as anonymizer from '@db-faker/anonymizer';

export const DumperConfigSchema = object({
  tables: array().required(),
});

export const AnonymizerConfigSchema = object({
  tables: array().required(),
  columns: array(anonymizer.ColumnConfigSchema).optional(),
});

export const ConfigSchema = object({
  connection: mixed<Knex.Config>().required(),
  dumper: DumperConfigSchema,
  anonymizer: AnonymizerConfigSchema,
  outputDirectory: string().required().default('tmp'),
});

export type Config = InferType<typeof ConfigSchema>;
