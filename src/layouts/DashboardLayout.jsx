import { AppSidebar } from "@/components/layout/dashboard/app-sidebar";
import DashboardBreadcrumb from "@/components/layout/dashboard/includes/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ADMIN_ROLES } from "@/constant/roles";
import { useAppSelector } from "@/store/hooks";
import useCheckRoles from "@/utils/check-roles";
import { NavigationIcons } from "@/components/icons";
import { Navigate, Outlet } from "react-router-dom";

const PATH_PREFIX = "/dashboard";

export default function DashboardLayout() {
  const havePermission = useCheckRoles(ADMIN_ROLES);
  const isFundManger = useCheckRoles(["Fund Manager"]);
  const complianceMenu = [
    {
      title: "Compliance",
      url: PATH_PREFIX,
      breadcrumbText: "Compliance",
      isSection: true,
      items: [
        {
          title: "Limited Partners",
          url: PATH_PREFIX + "/limited-partners",
          icon: NavigationIcons.LimitedPartners,
          breadcrumbText: "Limited Partners",
        },
        {
          title: "Portfolio Companies",
          url: PATH_PREFIX + "/portfolio-companies",
          icon: NavigationIcons.PortfolioCompanies,
          breadcrumbText: "Portfolio Companies",
        },
        {
          title: "Drawdowns",
          url: PATH_PREFIX + "/drawdowns",
          icon: NavigationIcons.Drawdowns,
          breadcrumbText: "Drawdowns",
        },
        // {
        //   title: "SEBI Reports",
        //   url: PATH_PREFIX + "/sebi-reports",
        //   icon: ClipboardCheck,
        //   breadcrumbText: "SEBI Reports",
        // },
        {
          title: "Fund Details",
          url: PATH_PREFIX + "/funds-details",
          icon: NavigationIcons.FundDetails,
          breadcrumbText: "Fund Details",
        },
        {
          title: "Entities",
          url: PATH_PREFIX + "/entities",
          icon: NavigationIcons.Entities,
          breadcrumbText: "Entities",
        },
      ],
      // hiddenIcon: true,
    },
  ];

  const adminMenu = [
    {
      title: "Admin",
      url: PATH_PREFIX,
      breadcrumbText: "Admin",
      isSection: true,
      items: [
        {
          title: "Users Dashboard",
          url: PATH_PREFIX + "/users",
          icon: NavigationIcons.Users,
          breadcrumbText: "Users",
        },
      ],
    },
  ];

  const menu = [
    {
      title: "Overview",
      breadcrumbText: "Overview",
      url: PATH_PREFIX,
      isSection: true,
      items: [
        {
          title: "Dashboard",
          url: PATH_PREFIX,
          icon: NavigationIcons.Dashboard,
          isIndex: true,
          breadcrumbText: "Dashboard",
        },
        {
          title: "Processes",
          url: PATH_PREFIX + "/processes",
          icon: NavigationIcons.Processes,
          breadcrumbText: "Processes",
        },
        {
          title: "Tasks",
          url: PATH_PREFIX + "/task",
          icon: NavigationIcons.Tasks,
          breadcrumbText: "Tasks",
        },
        {
          title: "Documents",
          url: PATH_PREFIX + "/documents",
          icon: NavigationIcons.Documents,
          breadcrumbText: "Documents",
        },
        ...(isFundManger
          ? [
              {
                title: "Activity Log",
                url: PATH_PREFIX + "/activity-log",
                breadcrumbText: "Activity Log",
                icon: NavigationIcons.ActivityLog,
              },
            ]
          : []),
      ],
    },
    ...(havePermission ? complianceMenu : []),
    ...(isFundManger ? adminMenu : []),
  ];

  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar menu={menu} user={user} />
      <SidebarInset className="max-w-full overflow-x-auto">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumb menu={menu} prefix={PATH_PREFIX} />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
            {/* <AuthButtons /> */}
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
