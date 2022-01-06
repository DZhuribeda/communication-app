import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Button, ButtonAction } from "../components/core/button/button";
import { Size } from "../components/core/general";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <div>
    <Button {...args} size={Size.sm}>
      Button
    </Button>
    <Button {...args} size={Size.md}>
      Button
    </Button>
    <Button {...args} size={Size.lg}>
      Button
    </Button>
    <Button {...args} size={Size.xl}>
      Button
    </Button>
    <Button {...args} size={Size.xxl}>
      Button
    </Button>
    <Button {...args} size={Size.sm} disabled>
      Button
    </Button>
    <Button {...args} size={Size.md} disabled>
      Button
    </Button>
    <Button {...args} size={Size.lg} disabled>
      Button
    </Button>
    <Button {...args} size={Size.xl} disabled>
      Button
    </Button>
    <Button {...args} size={Size.xxl} disabled>
      Button
    </Button>
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  action: ButtonAction.PRIMARY,
};

export const Secondary = Template.bind({});

Secondary.args = {
  action: ButtonAction.SECONDARY,
};

export const SecondaryGray = Template.bind({});

SecondaryGray.args = {
  action: ButtonAction.SECONDARY_GRAY,
};

export const Tertiary = Template.bind({});

Tertiary.args = {
  action: ButtonAction.TERTIARY,
};

export const TertiaryGray = Template.bind({});

TertiaryGray.args = {
  action: ButtonAction.TERTIARY_GRAY,
};

export const Link = Template.bind({});

Link.args = {
  action: ButtonAction.LINK,
};

export const LinkGray = Template.bind({});

LinkGray.args = {
  action: ButtonAction.LINK_GRAY,
};
