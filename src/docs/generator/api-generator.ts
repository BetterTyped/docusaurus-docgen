import * as path from "path";
import { JSONOutput } from "typedoc";

import { trace, error } from "../../helpers/log.utils";
import { createFile } from "./utils/file.utils";
import { pageRenderer } from "../renderer/renderer";
import { PackageOptions, PluginOptions } from "../../types/package.types";
import { getKindName } from "../pages/utils/display.utils";

const docsExtension = ".mdx";

type ApiGeneratorProps = {
  packageName: string;
  parsedApiJsons: JSONOutput.ProjectReflection[];
  packageDocsDir: string;
  docsGenerationDir: string;
  pluginOptions: PluginOptions;
  packageOptions: PackageOptions;
};

export const apiGenerator = ({
  packageName,
  parsedApiJsons,
  packageDocsDir,
  pluginOptions,
  packageOptions,
}: ApiGeneratorProps) => {
  const parsedApiJson = parsedApiJsons[0];

  parsedApiJson.children?.forEach((reflection) => {
    const { name } = reflection;
    const kind = getKindName(reflection.kind, name);

    if (!kind) {
      return trace(`Module ${kind} not parsed. Missing type specification.`);
    }

    const data = pageRenderer({
      reflection,
      reflectionsTree: parsedApiJsons,
      pluginOptions,
      packageOptions,
      npmName: parsedApiJson.name,
      packageName,
    });

    try {
      const pagePath = path.join(packageDocsDir, kind, name + docsExtension);
      createFile(pagePath, data);
    } catch (err) {
      error(`Cannot create file for ${name}`);
      error(err);
    }
  });
};
