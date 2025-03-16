import { useLocation, Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function NavMenu({ title, items, hiddenIcon }) {
  const location = useLocation();

  return (
    <SidebarGroup
      className={cn({ "group-data-[collapsible=icon]:hidden": hiddenIcon })}
    >
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                to={item.url}
                className={cn({ "bg-gray-200": location.pathname === item.url })}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavMenu;