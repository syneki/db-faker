import { array, InferType, object, string } from 'yup';

export const ColumnConfigSchema = object({
  name: string().required(),
  engine: string().required(),
});

export const TableConfigSchema = object({
  name: string().required(),
  columns: array(ColumnConfigSchema).required(),
});

export const ConfigSchema = object({
  tables: array(TableConfigSchema).optional(),
  columns: array(ColumnConfigSchema).optional(),
  files: array().of(string().required()).required(),
  outputDirectory: string().optional().default('tmp/anonymized'),
});

export type ColumnConfig = InferType<typeof ColumnConfigSchema>;
export type TableConfig = InferType<typeof TableConfigSchema>;
export type Config = InferType<typeof ConfigSchema>;
