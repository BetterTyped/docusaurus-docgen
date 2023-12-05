import React from "react";

import { PagePropsType } from "../../../types/page.types";
import { getChildren, getProperties } from "../utils/properties.utils";
import { Property } from "./property";

export const Properties: React.FC<PagePropsType> = (props) => {
  const { reflection, reflectionsTree } = props;
  const children = getChildren(reflection);

  if (!children) return null;

  const properties = getProperties(children, reflectionsTree);

  return (
    <div className="api-docs__properties">
      {properties.map((prop, index) => (
        <Property key={index} {...props} reflection={prop} />
      ))}
    </div>
  );
};
