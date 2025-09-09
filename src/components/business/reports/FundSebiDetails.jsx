"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const InfoItem = ({ label, value, className }) => (
  <div className={cn("space-y-1", className)}>
    <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
    <p className="text-sm font-medium break-words">{value || "-"}</p>
  </div>
);

const CustomCard = ({ title, children, className }) => (
  <div
    className={cn("rounded-lg border bg-card p-4", className)}
  >
    <h3 className="mb-1 text-xs font-medium text-muted-foreground">{title}</h3>
    {children}
  </div>
);

const FundSebiDetails = () => {
  return (
    <div className="space-y-6 bg-muted/30 p-6">
      <h2 className="text-lg font-semibold">Fund Details</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CustomCard title="AIF Details">
          <div className="space-y-3">
            <h4 className="text-lg">AJVC Fund</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={"outline"} className="px-2 py-1 text-xs">
                AIF123456
              </Badge>
              <Badge variant={"outline"} className="px-2 py-1 text-xs">
                AIF123456
              </Badge>
              <Badge variant={"outline"} className="px-2 py-1 text-xs">
                AIF123456
              </Badge>
              <Badge variant={"outline"} className="px-2 py-1 text-xs">
                AIF123456
              </Badge>
            </div>
          </div>
        </CustomCard>

        <CustomCard title="Scheme Details">
          <div className="space-y-3">
            <h4 className="text-lg">Ajvc Fund Scheme of Ajvc Trust</h4>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-100">
                ACTIVE
              </Badge>
              <Badge variant="outline" className="px-2 py-1 text-xs">
                AIF123456
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-muted-foreground/30 bg-muted text-xs text-foreground"
                >
                  Extension Permitted
                </Badge>
                <Badge variant="outline">10 Years</Badge>
              </div>
            </div>
          </div>
        </CustomCard>

        <CustomCard title="Manager">
          <div className="space-y-3">
            <h4 className="text-base font-semibold">
              Founders Compass Ventures LLC
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">PAN: : AAJFC9952B</Badge>
              <Badge variant="outline">tes @founderscompass.com</Badge>
            </div>

            <Badge
              variant="outline"
              className="mt-2 flex break-words whitespace-pre-wrap"
            >
              <span>
                <span className="mb-1 block tracking-wide">Address</span> Desk
                134-291, Wework Futura, Sy No 13316, Gte 4944, Magarpatta Road,
                Kirtane Baugh, Magarpatta, Hadapsar I.e., Pune, Pune City,
                Maharashtra, India, 411028
              </span>
            </Badge>
          </div>
        </CustomCard>

        <CustomCard title="Fund Manager">
          <div className="space-y-3">
            <h4 className="text-base font-semibold">Aviral Bhatnagar</h4>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">PAN: BLIVP8226T0</Badge>
              <Badge variant="outline">DIN/DPIN: 08771203</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Date of Appointment: 19-08-2024</Badge>
              <Badge variant="outline">Date of Resignation: -</Badge>
            </div>
          </div>
        </CustomCard>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CustomCard title="RTA">
          <h4 className="text-lg">Orbis Financial Corporation Limited</h4>
        </CustomCard>

        <CustomCard title="Custodian">
          <h4 className="text-lg">Orbis Financial Corporation Limited</h4>
        </CustomCard>

        <CustomCard title="AIF SI Portal Login ID">
          <h4 className="text-lg">558142</h4>
        </CustomCard>

        <CustomCard title="Compliance Officer">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Karthik Jayakumar</h4>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Mobile: 9790741975</Badge>
              <Badge variant="outline">karthik@peritumpartners.com</Badge>
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
  );
};

export default FundSebiDetails;
