import * as TypeDoc from "typedoc";

export type PluginOptions = {
  outDir: string;
  packages: PackageOptions[];
  id?: string;
  generateMdx?: boolean;
  tsConfigPath?: string;
  typeDocOptions?: Partial<TypeDoc.TypeDocOptions>;
  watch?: boolean;
};

export type PackageOptions = {
  title: string;
  dir: string;
  entryPath: string | string[];
  logo?: string;
  description?: string;
  tsconfigName?: string;
  tsconfigDir?: string;
  readmeName?: string;
  readmeDir?: string;
  showImports?: boolean;
};

export type PackageOptionsFileParts = Pick<
  PackageOptions,
  "title" | "logo" | "description" | "readmeName" | "showImports"
>;

export type PackageOptionsFile = {
  id: string;
  packages: PackageOptionsFileParts[];
};

export type PkgMeta = {
  title: string;
  packageDocsJsonPath: string;
  packageDocsDir: string;
};
