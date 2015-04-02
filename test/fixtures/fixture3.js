import fs from 'fs';
import { default as path } from 'path';
import * as foo from 'foo';

/**
 * Anonymous function assignment.
 */
let anonFn = () => {};

/** A */ let a = 1;
/** B */ var b = 2;
/** C */ const c = 3;

/**
 * Object.
 */
var obj = {
  /** Property */ prop: true,
  /** Method */ fn () {}
};

// Don't explode.
export let d = 1;
export { obj as default };
