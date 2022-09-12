import * as _ from 'lodash';

export class Config<T extends object> {
  config: T;

  constructor(config: T) {
    this.config = config;
  }

  public get(prop: string): any {
    return _.at<T>(this.config, prop as any)[0] as any;
  }
}
