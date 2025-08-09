// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const importantDates = [
//   { title: "PPM Final Draft Sent", date: "12th August 2024" },
//   { title: "PPM Taken on Record", date: "7th February 2025" },
//   { title: "Scheme Launch", date: "15th March 2025" },
//   { title: "Initial Close", date: "20th March 2025" },
//   { title: "Final Close", date: "20th June 2025" },
//   { title: "End Date of Scheme", date: "20th July 2025" },
//   { title: "End Date of Extended Term", date: "30th August 2025" },
// ];

// const entities = [
//   "Manager",
//   "Trust",
//   "Custodian",
//   "RTA",
//   "Tax",
//   "Accountant",
//   "Auditor",
//   "Trustee",
//   "Legal",
//   "Compliance Officer",
//   "Investment Officer",
//   "Valuer",
// ];

// export default function FundDetailsPage() {
//   return (
//     <div className="p-6 space-y-6">
//       <Tabs defaultValue="scheme" className="w-full">
//         <TabsList className="w-full grid grid-cols-2 mb-4">
//           <TabsTrigger value="scheme">Scheme/AIF</TabsTrigger>
//           <TabsTrigger value="entities">Entities</TabsTrigger>
//         </TabsList>

//         <TabsContent value="scheme">
//           <div className="flex flex-col lg:flex-row gap-6">
//             <div className="flex-1 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Scheme Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-2">
//                     <div className="text-base font-semibold">
//                       Ajvc Fund Scheme of Ajvc Trust
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <Badge variant="success">Active</Badge>
//                       <Badge>AWE0ER123</Badge>
//                       <Badge>Extension Permitted</Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Total Fund Size</CardTitle>
//                   </CardHeader>
//                   <CardContent className="text-xl font-bold">
//                     ₹180,000,000,000
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>AIF Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="text-base font-semibold">AJVC Fund</div>
//                   <div className="flex flex-wrap gap-2">
//                     <Badge>AAKTA6772D</Badge>
//                     <Badge>IN/AIF2/24-25/1578</Badge>
//                     <Badge>Trust</Badge>
//                     <Badge>Category II AIF</Badge>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
//                   <div>
//                     <div className="text-muted-foreground text-sm">HDFC Bank</div>
//                     <div className="font-medium text-base">AJVC</div>
//                     <div className="text-sm">1232459832748932</div>
//                     <div className="text-sm">HDFCO90000</div>
//                   </div>
//                   <div>
//                     <div className="text-muted-foreground text-sm">Bank Contact</div>
//                     <div className="font-medium text-base">Aviral Bhatnagar</div>
//                     <div className="text-sm">+91 9999999999</div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <Card>
//                   <CardContent className="pt-4">
//                     <div className="text-muted-foreground text-sm">Target Fund Size</div>
//                     <div className="text-lg font-semibold">₹100,000,00,000</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardContent className="pt-4">
//                     <div className="text-muted-foreground text-sm">Corpus as on Initial Close</div>
//                     <div className="text-lg font-semibold">₹80,000,00,000</div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardContent className="pt-4">
//                     <div className="text-muted-foreground text-sm">Greenshoe Option</div>
//                     <div className="text-lg font-semibold">₹80,000,000</div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="lg:w-80">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Important Dates</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {importantDates.map((d, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                       <div className="mt-1 h-4 w-4 rounded-full bg-black" />
//                       <div>
//                         <div className="font-medium">{d.title}</div>
//                         <div className="text-muted-foreground text-sm">{d.date}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="entities">
//           <Card className={"p-1 gap-1"}>
//             <CardHeader>
//               <CardTitle>Entities</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {entities.map((role, i) => (
//                   <Card key={i} className="shadow-none border">
//                     <CardContent className="flex items-start gap-4 py-4">
                      
//                       <div>
//                         <div className="text-sm text-muted-foreground mb-1">{role}</div>
//                         <div className="font-medium">Aviral Bhatnagar</div>
//                         <div className="text-sm text-muted-foreground">
//                           aviral@ajuniorvc.com
//                         </div>
//                         <div className="text-sm">+91 9999999999</div>
//                         <div className="flex flex-wrap gap-2 pt-1">
//                           <Badge>PAN: AWERF6545435</Badge>
//                           <Badge>TAN: TRSFDS324090</Badge>
//                         </div>
//                       </div>
//                       <Avatar className="h-18 w-18">
//                         <AvatarImage src={`https://i.pravatar.cc/150?u=${role}`} className="h-18 w-18" />
//                         <AvatarFallback>{role[0]}</AvatarFallback>
//                       </Avatar>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
