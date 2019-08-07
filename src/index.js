export * from './context';
import { patch as patchNatives } from './natives';
import { patch as patchPromise } from './async';

patchNatives();
if (typeof Promise !== 'undefined') {
  patchPromise();
}
