import { AbstractInput } from './abstract-input';
import { CsvInput } from './csv.input';

export const INPUTS: {
  [name: string]: new (...args: any) => AbstractInput;
} = {
  csv: CsvInput,
};
