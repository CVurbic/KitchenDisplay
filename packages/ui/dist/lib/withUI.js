"use strict";
import deepmerge from "deepmerge";
import config from "../tailwind.config";
export function withUI(tailwindConfig) {
  return deepmerge(
    tailwindConfig,
    deepmerge(config, {
      content: ["./node_modules/@extension/ui/lib/**/*.{tsx,ts,js,jsx}"]
    })
  );
}
//# sourceMappingURL=withUI.js.map
