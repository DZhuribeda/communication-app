import React from "react";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MessageIcon from "@material-ui/icons/Message";

const menuItems = [
  {
    href: "/",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    href: "/channels",
    title: "Channels",
    icon: <MessageIcon />,
  },
];

export const mainListItems = (
  <div>
    {menuItems.map((item) => (
      <Link key={item.href} href={item.href} passHref>
        <ListItem button component="a">
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </Link>
    ))}
  </div>
);
