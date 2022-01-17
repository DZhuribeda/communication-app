import React from "react";
import { useState } from "react";

import { Select } from "../components/core/select/select";

export default {
  title: "Select",
  component: Select,
};

const people = [
  { label: "Wade Cooper" },
  { label: "Arlene Mccoy" },
  { label: "Devon Webb" },
  { label: "Tom Cook" },
  { label: "Tanya Fox" },
  { label: "Hellen Schmidt" },
];

const Template = (args) => {
  const { action } = args;
  const [selected, setSelected] = useState(people[0]);
  return (
    <Select
      {...args}
      label="Person"
      options={people}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};

export const Errored = Template.bind({});

Errored.args = {
  error: "This is an error",
};
