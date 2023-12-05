import React from "react";

import { PagePropsType } from "../../../types/page.types";
import { Type } from "./type";

export const Sources: React.FC<PagePropsType> = (props) => {
  const { reflection } = props;
  if (
    !(
      "implementationOf" in reflection ||
      "inheritedFrom" in reflection ||
      "overwrites" in reflection
    )
  ) {
    return null;
  }

  return (
    <aside className="api-docs__sources">
      {reflection.implementationOf && (
        <div>
          Implementation of <Type {...props} reflection={reflection.implementationOf} />
        </div>
      )}

      {reflection.inheritedFrom && (
        <div>
          Inherited from <Type {...props} reflection={reflection.inheritedFrom} />
        </div>
      )}

      {reflection.overwrites && (
        <div>
          Overrides <Type {...props} reflection={reflection.overwrites} />
        </div>
      )}
    </aside>
  );
};
