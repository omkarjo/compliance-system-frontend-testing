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
          // { title: menuItem.breadcrumbText, url: menuItem.url, isIndex: false },
          {
            title: item.breadcrumbText || item.title,
            url: item.url,
            isIndex: item?.isIndex,
          },
        ];
      }
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.length > 0 &&
          breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator className="block" />
              <BreadcrumbItem className="block">
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
