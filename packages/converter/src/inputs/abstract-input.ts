export type InputResult = {
  [table: string]: any;
};

export abstract class AbstractInput {
  abstract run(): Promise<InputResult>;
}
