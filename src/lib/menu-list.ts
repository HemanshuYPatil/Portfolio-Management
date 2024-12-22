import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Zap,
  ZapOff
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Manage",
      menus: [
        {
          href: "",
          label: "Active Project",
          icon: Zap,
          submenus: [
            {
              href: "/projects",
              label: "Active Projects"
            },
            {
              href: "/projects/new",
              label: "New Project"
            }
          ]
        },
        {
          href: "",
          label: "Unactive Project",
          icon: ZapOff,
          submenus: [
            {
              href: "/unactive",
              label: "Projects"
            }
          ]
        },
       
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/profile",
          label: "Profile",
          icon: Users
        }
      ]
    }
  ];
}
