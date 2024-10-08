import React from "react";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers, materialCells } from "@jsonforms/material-renderers";
import schema from "../schemas/schema.json";
import uischema from "../schemas/uischema.json";
import { InfoPays } from "./types";

interface JsonFormWrapperProps {
  data: { countries: InfoPays[] };
  handleChange: (data: { data: { countries: InfoPays[] } }) => void;
}

const JsonFormWrapper: React.FC<JsonFormWrapperProps> = ({ data, handleChange }) => {
  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={materialRenderers}
      onChange={handleChange}
      cells={materialCells}
    />
  );
};

export default JsonFormWrapper;
