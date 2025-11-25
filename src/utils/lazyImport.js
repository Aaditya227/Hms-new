import { lazy } from "react";

/**
 * Creates a lazy loaded component with named export support
 * @param {() => Promise<any>} factory - The import factory function
 * @param {string} [exportName] - The name of the export to use
 * @returns {React.LazyExoticComponent<any>}
 */
export function lazyImport(factory, exportName) {
  return lazy(() =>
    factory().then((module) => {
      if (exportName) {
        const comp = module[exportName];
        if (!comp) {
          throw new Error(
            `lazyImport: export "${exportName}" not found in module (available: ${Object.keys(
              module
            ).join(", ")})`
          );
        }
        return { default: comp };
      }

      // If module already has a default export, return it as-is.
      if (module && module.default) return module;

      // If there is a single named export that looks like a React component, use it.
      const candidate = Object.values(module).find(
        (v) => typeof v === "function" || typeof v === "object"
      );
      if (candidate) return { default: candidate };

      throw new Error(
        "lazyImport: could not determine a component export from module"
      );
    })
  );
}
