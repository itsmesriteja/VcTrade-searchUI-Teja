/**
 * Fixes the issue with vuex not being able to find the types
 * Ref: https://stackoverflow.com/a/76478851/19941540
 */

declare module "vuex" {
  export * from "vuex/types/index.d.ts";
  export * from "vuex/types/helpers.d.ts";
  export * from "vuex/types/logger.d.ts";
  export * from "vuex/types/vue.d.ts";
}