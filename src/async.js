import { getCurrentContext, setCurrentContext, revertContext } from './context';
import { createHook } from 'async_hooks';

const contextsIds = {};
let patched = false;

const hook = createHook({
  init(asyncId, type, triggerAsyncId) {
    const ctx = getCurrentContext()
    if (ctx) {
      if (!contextsIds[asyncId]) contextsIds[asyncId] = []
      contextsIds[asyncId].push(ctx)
    }
  },
  before(asyncId) {
      if (contextsIds[asyncId]) {
        setCurrentContext(contextsIds[asyncId])
      }
  },
  after(asyncId) {
    if (contextsIds[asyncId]) {
      revertContext()
    }
  },
  destroy(asyncId) {
    if (contextsIds[asyncId]) {
      delete contextsIds[asyncId]
    }
  }
})

export const unpatch = () => {
  patched = false;
  hook.disable()
};

export const patch = () => {
  if (patched) {
    console.warn(`Cannot call patch() for promise twice`);
    return;
  }
  patched = true;
  hook.enable()
  return unpatch;
}
