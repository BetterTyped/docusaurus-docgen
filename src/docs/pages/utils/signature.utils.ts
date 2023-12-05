import { JSONOutput } from "typedoc";

import { getType } from "./types.utils";
import { getKindName } from "./display.utils";

export const getSignature = (
  reflection: JSONOutput.SomeReflection | JSONOutput.SomeType,
): JSONOutput.SignatureReflection => {
  const parametersKinds = ["Call", "Constructor"];

  // Methods
  if ("signatures" in reflection && reflection.signatures) {
    return reflection.signatures?.find((signature) => !!signature);
  }

  // Class / Function
  if ("children" in reflection && reflection.children) {
    return reflection.children
      ?.find((child) => parametersKinds.includes(getKindName(child.kind, child.name)))
      ?.signatures?.find((signature) => !!signature);
  }
  return null;
};

export const getSignatureType = (
  reflection: JSONOutput.SignatureReflection,
  reflectionsTree: JSONOutput.ProjectReflection[],
  { useArrow }: { useArrow?: boolean },
) => {
  const params =
    reflection.parameters?.map((param) => {
      const paramName = param.name;
      const rest = param.flags?.isRest ? "..." : "";
      const optional = param.flags?.isOptional ? "?" : "";

      return `${rest}${paramName}${optional}: ${getType(param.type, reflectionsTree, {
        deepScan: false,
      })}`;
    }) || [];

  const sign = useArrow ? " => " : ": ";

  return `(${params.join(", ")})${sign}${getType(reflection.type, reflectionsTree, {
    deepScan: false,
  })}`;
};
