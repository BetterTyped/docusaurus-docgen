import { JSONOutput } from "typedoc";

import {
  PackageOptions,
  PluginOptions,
  PackageOptionsFile,
  PackageOptionsFileParts,
} from "./package.types";

export type PagePropsType<T = JSONOutput.SomeReflection> = {
  reflection: T;
  reflectionsTree: JSONOutput.ProjectReflection[];
  npmName: string;
  packageName: string;
  pluginOptions: PluginOptions | PackageOptionsFile;
  packageOptions: PackageOptions | PackageOptionsFileParts;
};
