import FundSebiDetails from "@/components/Sebi/FundSebiDetails";

const data = {
  aifName: "AJVC Fund",
  aifPan: "AAKTA6772D",
  sebiRegistrationNumber: "IN/AIF2/24-25/1578",
  structure: "Trust",
  category: "Category II AIF",

  schemeName: "Ajvc Fund Scheme of Ajvc Trust",
  schemeStatus: "Active",
  schemeCode: "AWEOER123",
  extensionPermitted: true,
  tenure: "10 Years",

  managerName: "Founders Compass Ventures LLC",
  managerPan: "AAJFF6952B",
  managerEmail: "aviral@juniorvc.com",
  managerAddress: "Desk Hd-291, WeWork Futura, ...",

  fundManagerName: "Aviral Bhatnagar",
  fundManagerPan: "BLWPB2267G",
  fundManagerDin: "08711269",
  dateOfAppointment: "19-08-2024",
  dateOfResignation: "",

  rtaName: "Orbis Financial Corporation Limited",
  custodianName: "Orbis Financial Corporation Limited",
  portalLoginId: "558142",

  complianceName: "Karthik Jayakumar",
  complianceMobile: "9790741975",
  complianceEmail: "karthik@peritumpartners.com",
};


export default function SebiReportDetailsPage() {
  return (
    <div>
      <FundSebiDetails data={data} />
    </div>
  );
}
