/**
 * Placeholder type declarations for babel packages
 * This file helps TypeScript resolve the imports without requiring an npm install
 */

declare module '@babel/core' {
  export const transform: any;
  export const transformSync: any;
  export const transformAsync: any;
}

declare module '@babel/generator' {
  const generator: any;
  export default generator;
}

declare module '@babel/template' {
  const template: any;
  export default template;
}
