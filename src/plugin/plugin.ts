import { LoadContext } from "@docusaurus/types";
import * as path from "path";

import { prepareApiDirectory } from "../docs/generator/utils/file.utils";
import { PluginOptions } from "../types/package.types";
import { trace, info } from "../utils/log.utils";
import { buildDocs } from "../docs/docs";

const name = "docusaurus-docgen";
const ids: string[] = [];

const generateDocs = async (context: LoadContext, options: PluginOptions) => {
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
    await buildDocs(docsGenerationDir, generatedFilesDir, options);
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
      if (options.id && !ids.includes(options.id)) {
        ids.push(options.id);
        await generateDocs(context, options);
      }
    },
  };
}
