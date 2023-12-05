import React from "react";

import { PagePropsType } from "../../../types/page.types";
import { getMethods } from "../utils/methods.utils";
import { Method } from "./method";
import { getChildren } from "../utils/properties.utils";

export const Methods: React.FC<PagePropsType> = (props) => {
  const { reflection, reflectionsTree } = props;
  const children = getChildren(reflection);

  if (!children) return null;

  const methods = getMethods(children, reflectionsTree);

  return (
    <div className="api-docs__methods">
      {methods.map((method, index) => {
        return <Method {...props} key={index} reflection={method} />;
      })}
    </div>
  );
};
