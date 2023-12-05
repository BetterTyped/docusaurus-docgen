import { JSONOutput, ReflectionKind } from "typedoc";

import { StringType } from "./types.utils";
import { isMethod } from "./methods.utils";

export const parens = (element: string, needsParens?: boolean) => {
  if (!needsParens) {
    return element;
  }

  return `(${element})`;
};

export const objectToString = (value: Record<string, StringType> | string, level = 0) => {
  if (typeof value === "string") return value;
  const addIndent = (spaces: number) => {
    let strOutput = "";
    for (let i = 0; i < spaces; i += 1) {
      strOutput += "  ";
    }
    return strOutput;
  };
  let strOutput = "";

  Object.keys(value).forEach((key) => {
    if (typeof value[key] === "object") {
      strOutput += `${addIndent(level + 1) + key}: `;
      strOutput += `${objectToString(value[key], level + 1)};\n`;
    } else {
      strOutput += `${addIndent(level + 1) + key}: ${value[key]};\n`;
    }
  });

  return `{\n${strOutput}${addIndent(level - 1)}${addIndent(level)}}`.replace(/"/g, "");
};

const kindMap = Object.entries(ReflectionKind).reduce(
  (acc, [key, value]: [string, ReflectionKind]) => {
    acc[value] = key;
    return acc;
  },
  {} as Record<ReflectionKind, string>,
);

const isHook = (name: string) => {
  const isUppercase = name[3] === name[3]?.toUpperCase();
  return name.startsWith("use") && isUppercase;
};

/**
 * Find difference between regular function and hook
 */
export const getKindName = (kind: ReflectionKind, name: string) => {
  if (kind === ReflectionKind.Function && isHook(name)) {
    return "Hook";
  }
  return kindMap[kind];
};

export const getSortedChildren = (
  children: JSONOutput.DeclarationReflection[],
  reflectionsTree: JSONOutput.ProjectReflection[],
): (JSONOutput.DeclarationReflection & { isMethod: boolean })[] => {
  if (!children) {
    return [];
  }
  return children
    .map((child) => {
      return {
        ...child,
        isMethod: isMethod(child, reflectionsTree),
      };
    })
    .sort((a, b) => {
      const nameA = a.name.startsWith("_");
      const nameB = b.name.startsWith("_");

      if (a.isMethod && b.isMethod) {
        return 0;
      }
      if (a.isMethod) {
        return -1;
      }

      if (nameA && nameB) {
        return 0;
      }
      if (nameA) {
        return 1;
      }
      return -1;
    })
    .filter((element) => element.name !== "constructor");
};
