import { JSONOutput } from "typedoc";

import { getTag } from "./tags";
import { getComment } from "./comment";

export const getExamples = (reflection: JSONOutput.SomeReflection) => {
  const comment = getComment(reflection);
  if (!comment) return [];
  const example = getTag(comment, "@example");

  return example;
};

export const getExampleText = (reflection: JSONOutput.SomeReflection) => {
  const example = getExamples(reflection)[0];

  if (example) {
    return example.description;
  }

  return "";
};
