import { LoadContext } from "@docusaurus/types";
import * as path from "path";

import { prepareApiDirectory } from "../docs/generator/utils/file.utils";
import { PluginOptions } from "../types/package.types";
import { trace, info } from "../helpers/log.utils";
import { buildDocs } from "../docs/docs";
import { createInstance } from "../helpers/concurrency.utils";

const name = "docusaurus-docgen";

const generateDocs = async (
  context: LoadContext,
  options: PluginOptions,
  extra: { instanceFile: string; instanceDate: string },
) => {
  const { generatedFilesDir } = context;
  const { outDir } = options;
  const docsGenerationDir = path.join(generatedFilesDir, "..", outDir);

  if (options.generateMdx === undefined) {
    // eslint-disable-next-line no-param-reassign
    options.generateMdx = true;
  }

  prepareApiDirectory(docsGenerationDir);

  trace("Initializing plugin...");

  info("Successfully initialized plugin.");
  if (options.packages.length) {
    await buildDocs(docsGenerationDir, generatedFilesDir, options, extra);
    trace("Loading generated docs.");
  } else {
    trace("No packages found.");
  }
  // eslint-disable-next-line no-console
  console.log("\n");
};

export async function plugin(context: LoadContext, options: PluginOptions) {
  return {
    name,
    async loadContent() {
      const file = path.join(context.generatedFilesDir, "/loadingTypedoc.json");
      const date = createInstance(context.generatedFilesDir, file);

      await generateDocs(context, options, { instanceDate: date, instanceFile: file });
    },
  };
}
