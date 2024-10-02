"use strict";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};
//# sourceMappingURL=utils.js.map
