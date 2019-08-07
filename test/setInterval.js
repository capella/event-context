import { createContext } from '../src/context';
import { patch, unpatch } from '../src/async';
import { expect } from 'chai';
import { once } from 'lodash';

const nativeSetTimeout = global.setTimeout;

describe('createContext', () => {
  describe('patch setInterval', () => {
    before(patch);
    after(unpatch);

    it('should run the context', (done) => {
      const context = createContext();
      context.run(() => {
        const id = setInterval(() => {
          clearInterval(id);
          done();
        }, 60);
      });
    });
  });
});
