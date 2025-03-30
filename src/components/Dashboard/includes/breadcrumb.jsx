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
          { title: menuItem.breadcrumbText, url: menuItem.url , isIndex: false},
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
        {breadcrumbItems
          .filter((item) => !item.isIndex) 
          .map((item, index, arr) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="block">
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
              {index < arr.length - 1 && (
                <BreadcrumbSeparator className="block" />
              )}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
