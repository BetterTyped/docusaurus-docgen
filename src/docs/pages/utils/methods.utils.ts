import { JSONOutput, ReflectionKind } from "typedoc";

import { getReference } from "./reference.utils";

const isFunctionReflection = (
  reflection: JSONOutput.DeclarationReflection | JSONOutput.SomeType,
  reflectionsTree: JSONOutput.ProjectReflection[],
): boolean => {
  if (
    typeof reflection.type === "object" &&
    "target" in reflection.type &&
    typeof reflection.type.target === "number"
  ) {
    const referenceType = getReference(reflectionsTree, reflection.type.target, reflection.name);

    if (referenceType?.type?.type === "conditional") {
      if (
        referenceType.type?.trueType &&
        isFunctionReflection(referenceType.type.trueType, reflectionsTree)
      ) {
        return true;
      }
      if (
        referenceType.type?.falseType &&
        isFunctionReflection(referenceType.type.falseType, reflectionsTree)
      ) {
        return true;
      }
      if (
        referenceType.type?.checkType &&
        isFunctionReflection(referenceType.type.trueType, reflectionsTree)
      ) {
        return true;
      }
    }
    if (referenceType) {
      return isFunctionReflection(referenceType, reflectionsTree);
    }
  }
  if (
    typeof reflection.type === "object" &&
    reflection?.type &&
    "declaration" in reflection.type &&
    reflection.type.declaration
  ) {
    return !!reflection.type.declaration.signatures;
  }
  if ("declaration" in reflection && reflection.declaration) {
    return "signatures" in reflection.declaration && !!reflection.declaration?.signatures;
  }
  return false;
};

export const isMethod = (
  reflection: JSONOutput.DeclarationReflection,
  reflectionsTree: JSONOutput.ProjectReflection[],
) => {
  if (reflection.kind === ReflectionKind.Method) {
    return true;
  }
  return isFunctionReflection(reflection, reflectionsTree);
};

export const getMethods = (
  children: JSONOutput.DeclarationReflection[],
  reflectionsTree: JSONOutput.ProjectReflection[],
) => {
  if (!children) {
    return [];
  }
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
      return isMethod(element, reflectionsTree);
    });
};
