import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const portfolioCompanySchema = [
  { key: "startup_brand", label: "Startup Brand", type: "text" },
  { key: "company_name", label: "Company Name", type: "text" },
  { key: "sector", label: "Sector", type: "text" },
  {
    key: "product_description",
    label: "Product Description",
    type: "textarea",
  },
  { key: "registered_address", label: "Registered Address", type: "text" },
  { key: "pan", label: "PAN", type: "text" },
  { key: "isin", label: "ISIN", type: "text" },
];

export default function SheetPortfolioCompanyView({
  data = {},
  isOpen = true,
  onClose = () => {},
}) {
  if (!data || !data.company) return null;
  const company = data.company ?? {};
  const founders = Array.isArray(data.founders) ? data.founders : [];
  const documents = Array.isArray(data.documents) ? data.documents : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{company.company_name || "Company Details"}</SheetTitle>
          <SheetDescription>
            {company.sector || "No Sector Info"}
          </SheetDescription>
          {company.startup_brand && (
            <Badge variant="outline" className="mt-2 w-fit text-xs">
              {company.startup_brand}
            </Badge>
          )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />

        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {portfolioCompanySchema
                .filter(({ key }) => company[key])
                .map(({ key, label }) => (
                  <tr key={key}>
                    <td className="text-muted-foreground w-2/5 py-2 pr-4 font-medium">
                      {label}
                    </td>
                    <td className="py-2 break-all">{company[key]}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <hr className="mx-auto my-4 w-11/12" />
          <div className="">
            <h4 className="mx-auto mb-2 w-11/12 font-semibold">Founders</h4>
            {founders.length > 0 ? (
              <table className="mx-auto w-11/12 text-sm">
                <tbody>
                  {founders.map((founder, index) => (
                    <tr key={index}>
                      <td className="text-muted-foreground w-2/5 py-2 pr-4 font-medium">
                        Founder {index + 1}
                      </td>
                      <td className="flex flex-col py-2 break-all">
                        <span>
                          {founder.founder_name}
                          {` (${founder.founder_role})`}
                        </span>
                        <a href={`mailto:${founder.founder_email}`}>
                          {founder.founder_email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted-foreground ml-4 text-xs">
                No founders listed.
              </p>
            )}
          </div>

          <hr className="mx-auto my-4 w-11/12" />
          <div className="mx-auto w-11/12">
            <h4 className="mb-2 font-semibold">Documents</h4>
            {documents.length > 0 ? (
              <ul className="ml-4 list-disc text-sm">
                {documents.map((doc) => (
                  <li key={doc.portfolio_document_id || doc.document_type}>
                    <a
                      href={doc.doc_link || doc.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {doc.document_type || doc.type || "Document"}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground ml-4 text-xs">
                No documents uploaded.
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
