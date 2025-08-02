import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import DashboardBreadcrumb from "@/components/Dashboard/includes/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ADMIN_ROLES } from "@/constant/roles";
import { useAppSelector } from "@/store/hooks";
import useCheckRoles from "@/utils/check-roles";
import {
  Banknote,
  BookOpen,
  Bot,
  Building,
  ClipboardCheck,
  GalleryVerticalEnd,
  GitCompare,
  History,
  IndianRupee,
  SquareTerminal,
  User,
  UserCircle,
} from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const PATH_PREFIX = "/dashboard";

export default function DashboardLayout() {
  const havePermission = useCheckRoles(ADMIN_ROLES);
  const isFundManger = useCheckRoles(["Fund Manager"]);
  const complianceMenu = [
    {
      title: "Compliance",
      url: PATH_PREFIX,
      breadcrumbText: "Dashboard",
      items: [
        {
          title: "Limited Partners",
          url: PATH_PREFIX + "/limited-partners",
          icon: User,
        },
        {
          title: "Portfolio Companies",
          url: PATH_PREFIX + "/portfolio-companies",
          icon: Building,
        },
        {
          title: "Drawdowns",
          url: PATH_PREFIX + "/drawdowns",
          icon: IndianRupee,
        },
        {
          title: "SEBI Reports",
          url: PATH_PREFIX + "/sebi-reports",
          icon: ClipboardCheck,
        },
        {
          title: "Fund Details",
          url: PATH_PREFIX + "/funds-details",
          icon: Banknote,
        },
        {
          title: "Entitys",
          url: PATH_PREFIX + "/entities",
          icon: GalleryVerticalEnd,
        },
      ],
      // hiddenIcon: true,
    },
  ];

  const adminMenu = [
    {
      title: "Admin",
      url: PATH_PREFIX,
      breadcrumbText: "Dashboard",
      items: [
        {
          title: "Users Dashboard",
          url: PATH_PREFIX + "/users",
          icon: UserCircle,
        },
      ],
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
          icon: SquareTerminal,
          isIndex: true,
        },
        {
          title: "Processes",
          url: PATH_PREFIX + "/processes",
          icon: GitCompare,
        },
        {
          title: "Tasks",
          url: PATH_PREFIX + "/task",
          icon: Bot,
        },
        {
          title: "Documents",
          url: PATH_PREFIX + "/documents",
          icon: BookOpen,
        },
        ...(isFundManger
          ? [
              {
                title: "Activity Log",
                url: PATH_PREFIX + "/activity-log",
                breadcrumbText: "Activity Log",
                icon: History,
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumb menu={menu} prefix={PATH_PREFIX} />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
