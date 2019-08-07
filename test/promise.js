import { createContext, getCurrentContext, resetContexts } from '../src/context';
import { patch, unpatch } from '../src/async';
import { expect } from 'chai';
import { once } from 'lodash';

describe('createContext', () => {
  describe('Promise', () => {
    before(() => {
      resetContexts()
      patch()
    });
    after(() => {
      expect(getCurrentContext()).to.be.null;
      unpatch()
    });

    it('should work with Promise', done => {
      resetContexts()
      const ctx = createContext();
      ctx.run(() => {
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 10)
        });

        promise.then(value => {
          expect(value).to.equal(42);
          expect(getCurrentContext()).not.null;
          done()
        }).catch(done);
      });
    });

    it('should work with Promise.resolve', done => {
      const ctx = createContext();
      ctx.run(() => {
        let promise = Promise.resolve(42)
        promise.then(value => {
          expect(getCurrentContext()).not.null;
          done()
        }).catch(done);
      });
    });

    it('should work with await', done => {
      const ctx = createContext();
      ctx.run(async function () {
        try {
          let p = await Promise.resolve(123)
          expect(getCurrentContext()).not.null;
          done()
        } catch (e) {
          done(e)
        }
      });
    });

    it('should then work correctly', done => {
      resetContexts()
      const p = new Promise((resolve, reject) => {
        const ctx = createContext();
        ctx.run(() => {
          let promise = Promise.resolve(42)
          promise.then(value => {
            expect(getCurrentContext()).not.null;
            resolve(24)
          }).catch(reject);
        });
      });
      p.then(value => {
        expect(!!getCurrentContext()).to.be.false;
        done()
      }).catch(done);
    });

    it('should catch work correctly', done => {
      resetContexts()
      const p = new Promise((resolve, reject) => {
        const ctx = createContext();
        ctx.run(() => {
          let promise = Promise.resolve(42)
          promise.then(value => {
            expect(getCurrentContext()).not.null;
            throw new Error("42")
          }).catch(() => {
            expect(getCurrentContext()).not.null;
            resolve()
          }).catch(done);
        });
      });
      p.then(value => {
        expect(!!getCurrentContext()).to.be.false;
        done()
      }).catch(done);
    });

    it('should finally work correctly', done => {
      resetContexts()
      const p = new Promise((resolve, reject) => {
        const ctx = createContext();
        ctx.run(() => {
          let promise = Promise.resolve(42)
          promise.then(value => {
            expect(getCurrentContext()).not.null;
          }).finally(()=>{
            expect(getCurrentContext()).not.null;
            resolve()
          }).catch(done);
        });
      });
      p.then(value => {
        expect(!!getCurrentContext()).to.be.false;
        done()
      }).catch(done);
    });

    it('should stop promises', done => {
      const fail = label => done.bind(null, new Error(label));
      const ctx = createContext();
      ctx.run(() => {
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 20)
        });

        promise.then(value => {
          fail();
        });
      });

      setTimeout(ctx.dispose, 10);
      setTimeout(done, 30);
    });
  });
});
