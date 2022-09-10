import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { Config } from './config';

export function loadConfig<T extends object>(path: string) {
  const data = fs.readFileSync(path);
  const config = YAML.parse(data.toString('utf-8'));
  return new Config<T>(config);
}
