import React from "react";

import { PagePropsType } from "../../types/page.types";
import { Definition } from "./components/definition";
import { Description } from "./components/description";
import { Import } from "./components/import";
import { Name } from "./components/name";
import { Preview } from "./components/preview";
import { Returns } from "./components/returns";
import { Section } from "./components/section";
import { Separator } from "./components/separator";
import { Sources } from "./components/sources";

export const TypePage: React.FC<PagePropsType> = (props) => {
  return (
    <>
      <Name {...props} />
      <Separator />
      <Sources {...props} />
      <Import {...props} />
      <Section title="Description">
        <Description {...props} />
        <Definition {...props} />
      </Section>
      <Section title="Preview">
        <Preview {...props} />
      </Section>
      <Section title="Structure">
        <Returns {...props} />
      </Section>
    </>
  );
};
