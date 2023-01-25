import { RequiredKeys } from "../types/helpers.types";
import { PackageOptions } from "../types/package.types";

export const defaultPackageOptions: RequiredKeys<
  Omit<PackageOptions, "dir" | "entryPath" | "title">
> = {
  logo: "",
  description: "",
  tsconfigName: "tsconfig.json",
  tsconfigDir: "",
  readmeName: "README.md",
  readmeDir: "",
  showImports: true,
};
