let prevContext = null;
let currentContext = null;
let counter = 0

export const getCurrentContext = () => currentContext;
export const setCurrentContext = ctx => {
  prevContext = currentContext;
  currentContext = ctx;
}
export const revertContext = () => {
  currentContext = prevContext;
}

export const resetContexts = () => {
  prevContext = null;
  currentContext = null;
}

export const createContext = (label = counter) => {
  const ctx = {};
  let hasRun = false;
  let state = {};
  counter++;

  const run = (computation) => {
    if (hasRun) {
      throw new Error('Each context can only run once');
    }

    hasRun = true;
    ctx.parent = getCurrentContext();

    // inherit states
    if (ctx.parent) {
      const parentState = Object.create(ctx.parent.getState());
      state = Object.assign(parentState, state);
    }
    setCurrentContext(ctx);
    try {
      return computation();
    }
    finally {
      revertContext()
    }
  }

  // public API
  ctx.run = run;
  ctx.getState = () => state
  ctx.toString = () => {
    if (ctx.parent === null) return `[${label}]`;
    else return ctx.parent.toString()+`[${label}]`;
  }
  return ctx;
}

export const withContext = fn => function (...params) {
  const ctx = createContext();
  return ctx.run(() => fn.apply(this, params));
}
