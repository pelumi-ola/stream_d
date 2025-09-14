// import { FeaturedMatch } from "@/components/dashboard/featured-match";
// import { LatestMatches } from "@/components/dashboard/latest-matches";
// import { HighlightLeagues } from "@/components/dashboard/highlight-leagues";

// export default function DashboardPage() {
//   return (
//     <div className="flex flex-col justify-between p-6 space-y-6">
//       <div className="flex flex-col md:flex-row md:justify-between md:gap-8 space-y-6">
//         <FeaturedMatch />
//         <div className="flex flex-col items-center space-y-6 w-full md:w-68 md:h-50 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
//             Latest Highlight
//           </h3>
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             62 : 24
//           </div>

//           <div className="flex items-center gap-4 mt-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">MX</span>
//               </div>
//               <span className="text-sm font-medium">2 - 2</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">SE</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <LatestMatches />
//       <HighlightLeagues />
//     </div>
//   );
// }

import React from "react";
import DashboardPage from "@/components/dashboard/dashboard-page";

function Dashboard() {
  return (
    <>
      <DashboardPage />
    </>
  );
}

export default Dashboard;
