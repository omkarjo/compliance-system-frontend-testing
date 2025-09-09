import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavigationIcons } from "@/components/icons";
import NavHeading from "./includes/nav-heading";
import NavMenu from "./includes/nav-menu";
import NavUser from "./includes/nav-user";



export function AppSidebar({ menu, user, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeading
          data={{
            title: "Unified Compliance",
            subtitle: "A Junior VC",
            logo: NavigationIcons.Globe,
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        {menu.map((item) => (
          <NavMenu
            key={item.title}
            items={item.items}
            title={item.title}
            active={true}
            hiddenIcon={item?.hiddenIcon}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
