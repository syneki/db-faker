import * as _ from 'lodash';

export class Config<T extends object> {
  constructor(private config: T) {}

  public get(prop: string): any {
    return _.at<T>(this.config, prop as any)[0] as any;
  }
}
