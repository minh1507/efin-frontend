"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, User2, FerrisWheel, ChevronDown, ChevronUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface MenuItem {
  title: string;
  url?: string;
  icon?: React.ElementType;
  children?: MenuItem[];
}

const items: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: Home },
  {
    title: "Entertainment",
    icon: FerrisWheel,
    children: [
      { title: "Food and Drink", url: "/food-and-drink" },
      {
        title: "Sale",
        children: [
          { title: "Food Deals", url: "/sale-food" },
          {
            title: "Discounts",
            children: [
              { title: "Coupons", url: "/coupons" },
              { title: "Flash Sales", url: "/flash-sales" },
            ],
          },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderMenuItems = (menuItems: MenuItem[], level = 0) => {
    return menuItems.map((item) => (
      <SidebarMenuItem key={item.title}>
        {item.children ? (
          <>
            <SidebarMenuButton
              onClick={() => toggleMenu(item.title)}
              className="flex items-center justify-between gap-2 w-full p-3 rounded-md bg-gray-800 hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="w-5 h-5 text-gray-300" />}
                <span className="text-white">{item.title}</span>
              </div>
              {openMenus[item.title] ? (
                <ChevronUp className="text-gray-300" />
              ) : (
                <ChevronDown className="text-gray-300" />
              )}
            </SidebarMenuButton>
  
            {/* 🔹 Wrap nested items in a new SidebarMenu instead of SidebarMenuItem */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenus[item.title] ? "max-h-96 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"}`}>
              <SidebarMenu className="pl-5 border-l border-gray-600 mt-2">
                {renderMenuItems(item.children, level + 1)}
              </SidebarMenu>
            </div>
          </>
        ) : (
          <Link href={item.url || "#"} passHref>
            <SidebarMenuButton className="flex items-center gap-2 w-full p-3 rounded-md bg-gray-800 hover:bg-gray-700 transition-all">
              {item.icon && <item.icon className="w-5 h-5 text-gray-300" />}
              <span className="text-white">{item.title}</span>
            </SidebarMenuButton>
          </Link>
        )}
      </SidebarMenuItem>
    ));
  };
  

  return (
    <Sidebar className="bg-gray-900 h-screen w-64">
      <SidebarHeader className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">B</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}
