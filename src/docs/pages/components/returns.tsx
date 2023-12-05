import React from "react";

import { PagePropsType } from "../../../types/page.types";
import { getTag } from "../handlers/tags.utils";
import { getTypePresentation } from "../utils/types.utils";
import { Code } from "./code";
import { getChildren } from "../utils/properties.utils";
import { getSortedChildren } from "../utils/display.utils";
import { NonParsing } from "./non-parsing";
import { getCommentText } from "../handlers/comment";

export const Returns: React.FC<PagePropsType> = (props) => {
  const { reflection, reflectionsTree } = props;
  const { comment } = reflection;
  const returnTag = getTag(comment, "@returns")[0];
  const disableReturn = getTag(comment, "@disableReturns")[0];
  const children = getChildren(reflection);

  if (disableReturn && !returnTag) return null;

  const sorted = getSortedChildren(children, reflectionsTree);

  if (children) {
    return (
      <NonParsing>
        <div className="api-docs__returns">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((child) => {
                return (
                  <tr key={child.name}>
                    <td>
                      <code>
                        {child.name}
                        {child.isMethod ? "()" : ""}
                      </code>
                    </td>
                    <td>{getCommentText(child)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </NonParsing>
    );
  }
  return (
    <div className="api-docs__returns">
      {!disableReturn && <Code>{getTypePresentation(reflection, reflectionsTree)}</Code>}
    </div>
  );
};
