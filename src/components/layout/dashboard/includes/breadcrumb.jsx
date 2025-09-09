import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetFundById } from "@/react-query/query/Funds/useGetFundById";
import { getBreadcrumbSegments } from "@/lib/S3Utils";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function DashboardBreadcrumb({ menu }) {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;
  
  // Fetch fund data if we're on a fund details page
  const shouldFetchFund = currentPath.includes("/funds-details/") && params.id && !currentPath.includes("/create") && !currentPath.includes("/edit");
  const { data: fundData } = useGetFundById(params.id, { 
    enabled: shouldFetchFund 
  });

  // Determine the landing URL for a section
  const getSectionLandingUrl = (section) => {
    // For Overview, go to Dashboard
    if (section.breadcrumbText === "Overview") {
      return "/dashboard";
    }
    
    // For other sections, go to the first item in that section
    if (section.items && section.items.length > 0) {
      return section.items[0].url;
    }
    
    return section.url;
  };

  // Build complete breadcrumb hierarchy
  const buildBreadcrumbItems = () => {
    let breadcrumbItems = [];
    let currentSection = null;
    let currentPage = null;

    // Find the current page and its section
    menu.forEach((section) => {
      section.items.forEach((item) => {
        if (item.url === currentPath || currentPath.startsWith(item.url + "/")) {
          currentSection = section;
          currentPage = item;
        }
      });
    });

    if (currentSection && currentPage) {
      // Add section level (except for Overview > Dashboard which should show just Dashboard)
      if (!(currentSection.breadcrumbText === "Overview" && currentPage.isIndex)) {
        breadcrumbItems.push({
          title: currentSection.breadcrumbText,
          url: getSectionLandingUrl(currentSection),
          isSection: true,
          isClickable: true, // Section level now clickable
        });
      }

      // Add page level
      breadcrumbItems.push({
        title: currentPage.breadcrumbText || currentPage.title,
        url: currentPage.url,
        isPage: true,
        isClickable: currentPath !== currentPage.url, // Only clickable if not current page
        isCurrent: currentPath === currentPage.url,
      });

      // Add detail level if we're on a sub-page
      if (currentPath !== currentPage.url) {
        const detailBreadcrumb = getDetailBreadcrumb(currentPath, currentPage.url, params, fundData);
        if (detailBreadcrumb) {
          // Special handling for S3 documents with multiple folder levels
          if (detailBreadcrumb.s3Segments && detailBreadcrumb.s3Segments.length > 1) {
            // Add each S3 folder level as a separate breadcrumb item
            detailBreadcrumb.s3Segments.forEach((segment, index) => {
              const isLast = index === detailBreadcrumb.s3Segments.length - 1;
              breadcrumbItems.push({
                title: segment.name.charAt(0).toUpperCase() + segment.name.slice(1),
                url: `/dashboard/documents/${segment.path.endsWith("/") ? segment.path.slice(0, -1) : segment.path}`,
                isCurrent: isLast,
                isClickable: !isLast,
              });
            });
          } else {
            breadcrumbItems.push(detailBreadcrumb);
          }
        }
      }
    } else {
      // Fallback for pages not found in menu (shouldn't normally happen)
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        breadcrumbItems.push({
          title: pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1),
          url: currentPath,
          isCurrent: true,
        });
      }
    }

    return breadcrumbItems;
  };

  // Generate detail breadcrumbs for sub-pages
  const getDetailBreadcrumb = (currentPath, basePath, params, fundData) => {
    // Handle different detail page patterns
    if (currentPath.includes("/funds-details/")) {
      if (currentPath.includes("/create")) {
        return { title: "Create Fund", url: currentPath, isCurrent: true };
      } else if (currentPath.includes("/edit")) {
        return { title: "Edit Fund", url: currentPath, isCurrent: true };
      } else if (params.id) {
        // For fund details, show the scheme name if available, otherwise show Fund ID
        const title = fundData?.scheme_name || `Fund ${params.id}`;
        return { title, url: currentPath, isCurrent: true };
      }
    }

    if (currentPath.includes("/limited-partners/bulk-upload")) {
      return { title: "Bulk Upload", url: currentPath, isCurrent: true };
    }

    if (currentPath.includes("/drawdowns/") && params.quarter) {
      return { title: `Q${params.quarter} Details`, url: currentPath, isCurrent: true };
    }

    if (currentPath.includes("/processes/") && params.id) {
      return { title: "Process Details", url: currentPath, isCurrent: true };
    }

    if (currentPath.includes("/sebi-reports/") && params.id) {
      return { title: "Report Details", url: currentPath, isCurrent: true };
    }

    // Handle document sub-paths with S3 folder navigation
    if (currentPath.includes("/documents/")) {
      const pathParts = currentPath.split("/documents/")[1];
      if (pathParts) {
        // For S3 folder navigation, return an array of breadcrumb items
        const folder = decodeURIComponent(pathParts);
        const segments = getBreadcrumbSegments(folder.endsWith("/") ? folder : folder + "/");
        
        if (segments.length > 0) {
          // Return the last segment as the current breadcrumb
          const lastSegment = segments[segments.length - 1];
          return { 
            title: lastSegment.name.charAt(0).toUpperCase() + lastSegment.name.slice(1), 
            url: currentPath, 
            isCurrent: true,
            // Store all segments for potential multi-level breadcrumb expansion
            s3Segments: segments
          };
        }
      }
    }

    return null;
  };

  const breadcrumbItems = buildBreadcrumbItems();

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <BreadcrumbSeparator />
            )}
            <BreadcrumbItem>
              {item.isCurrent || !item.isClickable ? (
                <BreadcrumbPage>
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.url}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
