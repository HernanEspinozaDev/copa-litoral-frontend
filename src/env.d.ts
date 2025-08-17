/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Allow importing JSON files as modules throughout the project
declare module '*.json' {
  const value: any;
  export default value;
}
