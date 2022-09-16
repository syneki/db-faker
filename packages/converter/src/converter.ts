import Listr from "listr";
import { AbstractInput, InputResult } from "./inputs/abstract-input";
import { INPUTS } from "./inputs/inputs";
import { Config, ConfigSchema } from "./models/config";
import { OUTPUTS } from "./outputs";
import { AbstractOutput } from "./outputs/abstract-output";

export class Converter extends Listr {

    config: Config;

    inputResult: InputResult = {}

    constructor(config: Config) {
        super([
            {
                title: 'Importing Data',
                task: () => this.importData()
            },
            {
                title: 'Exporting Data',
                task: () => this.exportData()
            }
        ])

        this.config = ConfigSchema.validateSync(config);
    }


    async importData() {
        const input: AbstractInput = new INPUTS[this.config.input.type](this.config.input)
        this.inputResult = await input.run();
    }

    async exportData() {
        const output: AbstractOutput = new OUTPUTS[this.config.output.type](this.config.output)
        await output.run(this.inputResult);
    }

}