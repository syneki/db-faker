import { array, InferType, mixed, object, string } from 'yup';

export const OutputConfigSchema = object({
  type: string().required(),
  path: string().required().default('tmp/output'),
});

export const InputConfigSchema = mixed().concat(
  object({
    type: string().required(),
  })
);

export const ConfigSchema = object({
  input: InputConfigSchema.required(),
  output: OutputConfigSchema.required(),
});

export type OutputConfig = InferType<typeof OutputConfigSchema>;
export type Config = InferType<typeof ConfigSchema>;
