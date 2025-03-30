import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import DashbardBreadcum from "@/components/Dashboard/includes/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ADMIN_ROLES } from "@/constant/roles";
import { useAppSelector } from "@/store/hooks";
import useCheckRoles from "@/utils/check-roles";
import { GalleryVerticalEnd } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const PATH_PREFIX = "/dashboard";

export default function DashboardLayout() {
  const havePermission = useCheckRoles(ADMIN_ROLES);
  const activityViewPermission = useCheckRoles(["Fund Manager"]);
  const complianceMenu = [
    {
      title: "Compliance",
      url: PATH_PREFIX,
      breadcrumbText: "Dashboard",
      items: [
        {
          title: "Limited Partners",
          url: PATH_PREFIX + "/limited-partners",
          icon: GalleryVerticalEnd,
        },
        {
          title: "Portfolio Companies",
          url: PATH_PREFIX + "/portfolio-companies",
          icon: GalleryVerticalEnd,
        },
      ],
      hiddenIcon: true,
    },
  ];

  const menu = [
    {
      title: "Overview",
      breadcrumbText: "Dashboard",
      url: PATH_PREFIX,
      items: [
        {
          title: "Dashboard",
          url: PATH_PREFIX,
          icon: GalleryVerticalEnd,
          isIndex: true,
        },
        {
          title: "Tasks",
          url: PATH_PREFIX + "/task",
          icon: GalleryVerticalEnd,
        },
        {
          title: "Documents",
          url: PATH_PREFIX + "/documents",
          icon: GalleryVerticalEnd,
        },
        ...(activityViewPermission
          ? [
              {
                title: "Activity Log",
                url: PATH_PREFIX + "/activity-log",
                breadcrumbText: "Activity Log",
                icon: GalleryVerticalEnd,
              },
            ]
          : []),
      ],
    },
    ...(havePermission ? complianceMenu : []),
  ];

  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar menu={menu} user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashbardBreadcum menu={menu} prefix={PATH_PREFIX} />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
