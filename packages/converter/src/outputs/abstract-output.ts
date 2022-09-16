import { InputResult } from "../inputs/abstract-input";
import { OutputConfig } from "../models/config";

export abstract class AbstractOutput {

    config: OutputConfig

    constructor(config: OutputConfig) {
        this.config = config;
    }

    abstract run(input: InputResult): Promise<void>; 

}