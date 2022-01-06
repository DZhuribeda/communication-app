import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Input } from "../components/core/input/input";
import { Size } from "../components/core/general";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Input",
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => (
  <div style={{ width: 320 }}>
    <Input {...args} />
  </div>
);

export const WithLabel = Template.bind({});

WithLabel.args = {
  label: "Email",
  placeholder: "test@test.com",
};

export const WithLabelAndHint = Template.bind({});

WithLabelAndHint.args = {
  label: "Email",
  helperText: "Enter your email address",
  placeholder: "test@test.com",
};

export const WithLabelAndHintDisabled = Template.bind({});

WithLabelAndHintDisabled.args = {
  label: "Email",
  helperText: "Enter your email address",
  placeholder: "test@test.com",
  disabled: true,
};

export const Errored = Template.bind({});

Errored.args = {
  label: "Email",
  error: "This is required",
  placeholder: "test@test.com",
};
