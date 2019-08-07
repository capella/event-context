import buble from 'rollup-plugin-buble';
import strip from 'rollup-plugin-strip';

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const plugin = process.env.BUILD_PLUGIN;
const input = plugin ? `src/plugins/${plugin}/index.js` : 'src/index.js';
const dest = plugin ? `build/plugins-${plugin}` : 'build/core';

export default {
  input,
  output: [
    { file: `${dest}/index.js`, format: 'cjs' },
    { file: `${dest}/index.es.js`, format: 'es' },
    { file: `${dest}/dist/index.js`, format: 'umd', name: 'EventContext' },
  ],
  plugins: [strip({
    debugger: true,
    // defaults to `[ 'console.*', 'assert.*' ]`
    functions: [ 'console.*', 'assert.*', 'debug', 'alert' ],
  })]
};
