import { array, InferType, object, string } from "yup";
import { AbstractInput, InputResult } from "./abstract-input";
import { parse } from 'csv/sync';
import * as fs from 'fs';

const ConfigSchema = object({
    files: array().of(string().required()).required(),
})

type InputConfig = InferType<typeof ConfigSchema>

export class CsvInput extends AbstractInput {

    config: InputConfig

    constructor(config: InputConfig) {
        super();
        this.config = ConfigSchema.validateSync(config);
    }

    async run(): Promise<InputResult> {

        const data: InputResult = {};

        for (const file of this.config.files) {
            const res = fs.readFileSync(file);
            data[this.getTableName(file)] = parse(res, { columns: true });    
        }

        return data;
    }

    public getTableName(path: string): string {
        const a = path.split('/').pop();
        if (!a) throw new Error('File name invalid');
    
        const b = a.split('.')[0];
        if (!b) throw new Error('File name invalid');
    
        return b;
      }

}