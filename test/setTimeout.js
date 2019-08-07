import { createContext } from '../src/context';
import { patch, unpatch } from '../src/async';
import { expect } from 'chai';
import { once } from 'lodash';

const nativeSetTimeout = global.setTimeout;

describe('createContext', () => {
  describe('patch setTimeout', () => {
    before(patch);
    after(unpatch);

    it('should run the context', (done) => {
      const context = createContext();
      context.run(() => setTimeout(done, 60));
    });
  });
});
