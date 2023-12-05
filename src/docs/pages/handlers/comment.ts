import { JSONOutput } from "typedoc";

export const getComment = (reflection: JSONOutput.SomeReflection | undefined) => {
  if (!reflection) return;

  if (reflection.comment) {
    return reflection.comment;
  }

  if ("type" in reflection && "declaration" in reflection.type) {
    return getComment(reflection.type.declaration.signatures[0]);
  }
};

export const getCommentText = (reflection: JSONOutput.SomeReflection) => {
  const comment = getComment(reflection);

  if (comment) {
    return comment.summary.map(({ text }) => text).join("\n");
  }

  return "";
};
