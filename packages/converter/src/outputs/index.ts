import { AbstractOutput } from "./abstract-output";
import { SqlInsertOutput } from "./sql-insert.output";

export const OUTPUTS: {
    [name: string]: new (...args: any) => AbstractOutput
} = {
    'sql-insert': SqlInsertOutput
}