// import { Link } from 'react-router-dom';

// const DashboardHome = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
//       {/* Card 1 - Scan URL */}
//       <Link to="/scan" className="group">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan URL</h2>
//             <span className="text-white bg-indigo-700 rounded-full px-3 py-1 text-xs font-bold">
//               Start
//             </span>
//           </div>
//           <p className="text-white mt-3 group-hover:text-black">
//             Check your website's security by scanning for vulnerabilities.
//           </p>
//         </div>
//       </Link>

//       {/* Card 2 - Scan History */}
//       <Link to="/history" className="group">
//         <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan History</h2>
//             <span className="text-white bg-green-700 rounded-full px-3 py-1 text-xs font-bold">
//               View
//             </span>
//           </div>
//           <p className="text-black mt-3 group-hover:text-black">
//             View a log of your previous scans and results.
//           </p>
//         </div>
//       </Link>

//       {/* Card 3 - Settings */}
//       <Link to="/settings" className="group">
//         <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Settings</h2>
//             <span className="text-white bg-orange-700 rounded-full px-3 py-1 text-xs font-bold">
//               Adjust
//             </span>
//           </div>
//           <p className="text-black mt-3 group-hover:text-black">
//             Configure scanner and notification settings.
//           </p>
//         </div>
//       </Link>

     
//     </div>
//   );
// };

// export default DashboardHome;

// import { Link } from 'react-router-dom';

// const DashboardHome = () => {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {/* Card 1 - Scan URL */}
//         <Link to="/scan" className="group">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan URL</h2>
//               <span className="text-white bg-indigo-700 rounded-full px-3 py-1 text-xs font-bold">
//                 Start
//               </span>
//             </div>
//             <p className="text-white mt-3 group-hover:text-black">
//               Check your website's security by scanning for vulnerabilities.
//             </p>
//           </div>
//         </Link>

//         {/* Card 2 - Scan History */}
//         <Link to="/history" className="group">
//           <div className="bg-gradient-to-r items-center from-green-400 to-green-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan History</h2>
//               <span className="text-white bg-green-700 rounded-full px-3 py-1 text-xs font-bold">
//                 View
//               </span>
//             </div>
//             <p className="text-white mt-3 group-hover:text-black">
//               View a log of your previous scans and results.
//             </p>
//           </div>
//         </Link>

//         {/* Card 3 - Settings
//         <Link to="/settings" className="group">
//           <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-1">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Settings</h2>
//               <span className="text-white bg-orange-700 rounded-full px-3 py-1 text-xs font-bold">
//                 Adjust
//               </span>
//             </div>
//             <p className="text-white mt-3 group-hover:text-black">
//               Configure scanner and notification settings.
//             </p>
//           </div>
//         </Link> */}
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;

import { Link } from 'react-router-dom';

const DashboardHome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
        {/* Card 1 - Scan URL */}
        <Link to="/scan" className="group w-full max-w-sm">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan URL</h2>
              <span className="text-white bg-indigo-700 rounded-full px-3 py-1 text-xs font-bold">
                Start
              </span>
            </div>
            <p className="text-white mt-3 group-hover:text-black">
              Check your website's security by scanning for vulnerabilities.
            </p>
          </div>
        </Link>

        {/* Card 2 - Scan History */}
        <Link to="/history" className="group w-full max-w-sm">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white group-hover:text-gray-800">Scan History</h2>
              <span className="text-white bg-green-700 rounded-full px-3 py-1 text-xs font-bold">
                View
              </span>
            </div>
            <p className="text-white mt-3 group-hover:text-black">
              View a log of your previous scans and results here.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
