import React from "react";

import { PagePropsType } from "../../../types/page.types";

export const Definition: React.FC<PagePropsType> = (props) => {
  const { reflection } = props;

  const source = "sources" in reflection ? reflection.sources?.[0] : null;

  if (!source) return null;

  return (
    <p className="api-docs__definition">
      Defined in{" "}
      <a href={source.url}>
        {source.fileName}:{source.line}
      </a>
    </p>
  );
};
