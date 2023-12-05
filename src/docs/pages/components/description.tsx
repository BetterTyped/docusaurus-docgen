import React from "react";

import { PagePropsType } from "../../../types/page.types";
import { NonParsing } from "./non-parsing";

export const Description: React.FC<PagePropsType> = (props) => {
  const { reflection } = props;
  const { comment } = reflection;

  return (
    <div className="api-docs__description">
      <NonParsing>{comment?.summary.map(({ text }) => text).join("\n")}</NonParsing>
    </div>
  );
};
