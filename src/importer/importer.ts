import path from "path";
import { visit, SKIP } from "unist-util-visit";
import { JSONOutput } from "typedoc";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxjs } from "micromark-extension-mdxjs";

import { PackageOptionsFile, PkgMeta } from "../types/package.types";
import { pluginOptionsPath, packageConfigPath } from "../constants/paths.constants";
import { getFile, getMatchingElement } from "./utils/docs.utils";
import { getComponent } from "./components/component-map.utils";
import { cleanFileName } from "../docs/generator/utils/file.utils";
import { renderer } from "../docs/renderer/renderer";
import { getPackageDocsPath } from "../docs/generator/utils/package.utils";

export const docsImporter = (options: {
  packageRoute: string;
  apiDir: string;
  versionedDir?: string;
}) => {
  return () => {
    return (tree: any, file: any) => {
      const currentVersionedDir = file.history[0]
        ?.split("/")
        .find((pathPart: string) => pathPart.includes("versioned_docs"));
      const version = file.history[0]
        ?.split("/")
        .find((pathPart: string) => pathPart.includes("version-"));

      const { packageRoute, apiDir, versionedDir = currentVersionedDir } = options;

      const libDocsPath = version ? `${versionedDir}/${version}/${packageRoute}` : apiDir;
      const filesDir = path.join(file.cwd);
      const docsDir = path.join(filesDir, libDocsPath);
      const optionsPath = path.join(docsDir, pluginOptionsPath);

      const pluginOptions: PackageOptionsFile = getFile<PackageOptionsFile>(optionsPath) || {
        id: "",
        packages: [],
      };
      const packagesNames = pluginOptions.packages.map((pkg) => cleanFileName(pkg.title));
      const isMonorepo = pluginOptions.packages.length > 1;

      const reflectionsMap: { name: string; reflection: JSONOutput.ProjectReflection }[] =
        pluginOptions.packages.map((pkg) => {
          return {
            name: cleanFileName(pkg.title),
            // eslint-disable-next-line import/no-dynamic-require, global-require
            reflection: require(getPackageDocsPath(docsDir, cleanFileName(pkg.title), isMonorepo)),
          };
        });

      const packageRegex = `(${packagesNames.join("|")})`;
      const nameRegex = "([^ ]+)";
      const displayOptionParam = "([^ ]+)?";
      const rgx = new RegExp(`(@import ${packageRegex} ${nameRegex} ${displayOptionParam})`);

      visit(tree, "text", (node) => {
        const apiImport = node.value.match(rgx) as null | string[];

        if (apiImport) {
          const [, , packageName, elementName, componentType] = apiImport;
          const packageOptions = pluginOptions.packages.find(
            (pkg) => cleanFileName(pkg.title) === packageName,
          );

          if (!packageOptions) {
            throw new Error(`Cannot find package options for ${packageName}`);
          }

          if (!reflectionsMap.length) {
            throw new Error(`Cannot existing docs.json reflection files`);
          }

          const configPath = path.join(docsDir, packageName, packageConfigPath);

          // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
          const packageMeta: PkgMeta = require(configPath);

          const packageReflection = reflectionsMap.find(
            ({ name }) => cleanFileName(packageName) === name,
          )?.reflection;

          if (!packageReflection) {
            throw new Error(`Cannot find package reflection for ${packageName}`);
          }
          if (!packageReflection.children) {
            throw new Error(`Package reflections tree is empty`);
          }

          const packagesReflections = [
            packageReflection,
            ...reflectionsMap
              .filter(({ name }) => cleanFileName(packageName) !== name)
              .map(({ reflection }) => reflection),
          ];

          const reflection = getMatchingElement(packageReflection, elementName);
          const Component = getComponent(componentType.replace(")", ""));

          const jsx = renderer(
            {
              reflection,
              reflectionsTree: packagesReflections as any,
              npmName: packageReflection.name,
              packageName,
              pluginOptions,
              packageOptions,
            },
            Component,
          );

          const rawHtmlNode = fromMarkdown(jsx, {
            extensions: [mdxjs()],
            mdastExtensions: [mdxFromMarkdown()],
          }).children[0];

          Object.assign(node, rawHtmlNode);

          return SKIP;
        }
      });
    };
  };
};
