import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useLocation } from "react-router-dom";

export default function DashboardBreadcrumb({ menu }) {
  const location = useLocation();
  const currentPath = location.pathname;

  let breadcrumbItems = [];

  menu.forEach((menuItem) => {
    menuItem.items.forEach((item) => {
      if (item.url === currentPath) {
        breadcrumbItems = [
          { title: menuItem.title, url: menuItem.url },
          { title: item.title, url: item.url },
        ];
      }
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem className="block">
              <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
