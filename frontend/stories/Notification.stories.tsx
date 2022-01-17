import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  Notification,
  success,
  error,
  warning,
} from "../components/core/notification/notification";

export default {
  title: "Notification",
  component: Notification,
} as ComponentMeta<typeof Notification>;

const Template: ComponentStory<typeof Notification> = (args) => (
  <div style={{ width: 320 }}>
    <button onClick={args.action}>Trigger</button>
    <Notification />
  </div>
);

export const Success = Template.bind({});

Success.args = {
  action: () => success("Hey", { duration: 400000000 }),
};

export const Error = Template.bind({});

Error.args = {
  action: () => error("Hey", { duration: 400000000 }),
};

export const Warning = Template.bind({});

Warning.args = {
  action: () => warning("Hey", { duration: 400000000 }),
};
