import { Application, TSConfigReader, TypeDocReader } from "typedoc";

import { PluginOptions } from "../../types/package.types";
import { info } from "../../utils/log.utils";

export const parseTypescriptToJson = async (
  docsJsonPath: string,
  entryPoints: string[],
  tsconfig: string,
  pluginOptions: PluginOptions,
) => {
  try {
    // 1. Parser options to bootstrap project
    const app = await Application.bootstrapWithPlugins({
      excludeExternals: true,
      excludeInternal: true,
      excludePrivate: true,
      excludeProtected: true,
      exclude: [
        "node_modules",
        "tests",
        "__tests__",
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/*.tests.ts",
      ],
      logLevel: "Error",
      entryPointStrategy: "expand",
      ...pluginOptions.typeDocOptions,
      plugin: ["typedoc-plugin-markdown", ...(pluginOptions.typeDocOptions?.plugin || [])],
      tsconfig,
      entryPoints,
    });

    // 2. Prepare parser readers
    app.options.addReader(new TSConfigReader());
    app.options.addReader(new TypeDocReader());

    // 3. Parse project
    const project = await app.convert();

    // 4. Generate json output
    if (pluginOptions.watch) {
      app.convertAndWatch(async (watchProject) => {
        info("Watching for changes...");
        await app.generateJson(watchProject, docsJsonPath);
      });
    } else if (project) {
      await app.generateJson(project, docsJsonPath);
    } else {
      throw new Error(`Cannot generate docs for dir: ${docsJsonPath}.`);
    }
  } catch (err) {
    console.error(err);
  }
};
