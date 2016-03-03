import {resolve, dirname} from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

export default class FirebaseEnv {
  private _env: Object;

  constructor(env) {
    this._env = env;
  }

  static loadFromDirectory(start?: string) {
    let cur: string = start;
    let prev: string;
    let source: Object;

    while (!source && cur !== prev) {
      let envPath = resolve(cur, '../env.json');
      try {
        source = require(envPath);
      } catch (e) {
        prev = cur;
        cur = dirname(cur);
      }
    }

    return new FirebaseEnv(source || {});
  }

  get(path?: string, fallback?: any) {
    let segments = path.split('.');
    let cur: Object = this._env;
    for (let i = 0; i < segments.length; i++) {
      if (_.has(cur, segments[i])) {
        cur = cur[segments[i]];
      } else {
        if (typeof fallback !== 'undefined') {
          console.log('Using fallback for "' + path + '" environment value');
          return fallback;
        }
        throw new Error('Environment value "' + path + '" is not configured.');
      }
    }
    return cur;
  }
}
