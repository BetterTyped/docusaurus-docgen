import { JSONOutput } from "typedoc";

import { isMethod } from "./methods.utils";

export const getChildren = (reflection: JSONOutput.SomeReflection) => {
  if ("children" in reflection) {
    return reflection.children;
  }
  if (
    "type" in reflection &&
    reflection.type &&
    "declaration" in reflection.type &&
    reflection.type.declaration &&
    "children" in reflection.type.declaration
  ) {
    return reflection.type.declaration.children;
  }
  return null;
};

export const getProperties = (
  children: JSONOutput.DeclarationReflection[],
  reflectionsTree: JSONOutput.ProjectReflection[],
) => {
  if (!children) return [];
  return children
    .sort((a, b) => {
      const nameA = a.name.startsWith("_");
      const nameB = b.name.startsWith("_");

      if (nameA && nameB) {
        return 0;
      }
      if (nameA) {
        return 1;
      }
      return -1;
    })
    .filter((element) => element.name !== "constructor")
    .filter((element) => {
      return !isMethod(element, reflectionsTree);
    });
};
