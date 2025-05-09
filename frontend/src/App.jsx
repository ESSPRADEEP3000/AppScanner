// // import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// // import DashboardHome from './components/DashboardHome'; // Your updated Dashboard component
// // import Scanner from './components/Scanner';
// // import ScanHistory from './components/ScanHistory';
// // import Settings from './components/Settings';
// // import './index.css';
// // function App() {
// //   return (
// //     <Router>
// //       <div className="min-h-screen flex">
// //         <aside className="w-1/4 bg-gray-800 text-white p-6">
// //           <h1 className="text-3xl font-bold mb-8">Security Dashboard</h1>
// //           <nav>
// //             <ul>
// //               <li className="mb-4">
// //                 <Link to="/" className="hover:underline">Dashboard</Link>
// //               </li>
// //               <li className="mb-4">
// //                 <Link to="/scan" className="hover:underline">Scan URL</Link>
// //               </li>
// //               <li className="mb-4">
// //                 <Link to="/history" className="hover:underline">Scan History</Link>
// //               </li>
// //               <li className="mb-4">
// //                 <Link to="/settings" className="hover:underline">Settings</Link>
// //               </li>
// //             </ul>
// //           </nav>
// //         </aside>

// //         <main className="flex-1 bg-gray-100 p-6">
// //           <Routes>
// //             <Route path="/" element={<DashboardHome />} />
// //             <Route path="/scan" element={<Scanner />} />
// //             <Route path="/history" element={<ScanHistory />} />
// //             <Route path="/settings" element={<Settings />} />
// //           </Routes>
// //         </main>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import DashboardHome from './components/DashboardHome';
// import Scanner from './components/Scanner';
// import ScanHistory from './components/ScanHistory';
// import Settings from './components/Settings';
// import './index.css';

// // Import an icon library
// import { FaTachometerAlt, FaClipboardCheck, FaHistory, FaCog } from 'react-icons/fa';

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
//   };

//   return (
//     <Router>
//       <div className="min-h-screen flex ">
//         {/* Sidebar */}
//         <aside className={`bg-gray-800 text-white p-6   transition-transform duration-300 ${isSidebarOpen ? 'w-1/6' : 'w-16'}`}>
//           <h1 className={`text-3xl font-bold mb-8 ${isSidebarOpen ? 'block' : 'hidden'}`}>Security Dashboard</h1>
//           <nav>
//             <ul>
//               <li className="mb-4 flex items-center ">
//                 <Link to="/" className="hover:underline flex items-center">
//                   {isSidebarOpen ? <FaTachometerAlt className="mr-2" /> : <FaTachometerAlt className="mx-auto" />}
//                   {isSidebarOpen && <span>Dashboard</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/scan" className="hover:underline flex items-center">
//                   {isSidebarOpen ? <FaClipboardCheck className="mr-2" /> : <FaClipboardCheck className="mx-auto" />}
//                   {isSidebarOpen && <span>Scan URL</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/history" className="hover:underline flex items-center">
//                   {isSidebarOpen ? <FaHistory className="mr-2" /> : <FaHistory className="mx-auto" />}
//                   {isSidebarOpen && <span>Scan History</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/settings" className="hover:underline flex items-center">
//                   {isSidebarOpen ? <FaCog className="mr-2" /> : <FaCog className="mx-auto" />}
//                   {isSidebarOpen && <span>Settings</span>}
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//           <button
//           className="p-2 bg-gray-800 text-white ml-48"
//           onClick={toggleSidebar}
//         >
//           {isSidebarOpen ? '>' : '<'}
//         </button>
//         </aside>

//         {/* Toggle Button */}
       

//         <main className={`flex-1 bg-gray-100 p-6 ${isSidebarOpen ? 'ml-48' : ''}`}>
//           <Routes>
//             <Route path="/" element={<DashboardHome />} />
//             <Route path="/scan" element={<Scanner />} />
//             <Route path="/history" element={<ScanHistory />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import DashboardHome from './components/DashboardHome';
// import Scanner from './components/Scanner';
// import ScanHistory from './components/ScanHistory';
// import Settings from './components/Settings';
// import './index.css';

// // Import an icon library
// import { FaTachometerAlt, FaClipboardCheck, FaHistory, FaCog, FaBars } from 'react-icons/fa';

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
//   };

//   return (
//     <Router>
//       <div className="min-h-screen flex">
//         {/* Sidebar */}
//         <aside
//           className={`bg-gray-800 text-white p-6 transition-transform duration-300 
//           ${isSidebarOpen ? 'w-1/6' : 'w-16'} fixed top-0 left-0 h-full shadow-lg`}
//         >
//           <h1
//             className={`text-3xl font-bold mb-8 transition-opacity duration-300 
//             ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} text-yellow-400`}
//           >
//             Security Dashboard
//           </h1>
//           <nav>
//             <ul>
//               <li className="mb-4 flex items-center">
//                 <Link to="/" className="hover:text-yellow-300 flex items-center">
//                   {isSidebarOpen ? (
//                     <FaTachometerAlt className="mr-2" />
//                   ) : (
//                     <FaTachometerAlt className="mx-auto" />
//                   )}
//                   {isSidebarOpen && <span>Dashboard</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/scan" className="hover:text-yellow-300 flex items-center">
//                   {isSidebarOpen ? (
//                     <FaClipboardCheck className="mr-2" />
//                   ) : (
//                     <FaClipboardCheck className="mx-auto" />
//                   )}
//                   {isSidebarOpen && <span>Scan URL</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/history" className="hover:text-yellow-300 flex items-center">
//                   {isSidebarOpen ? <FaHistory className="mr-2" /> : <FaHistory className="mx-auto" />}
//                   {isSidebarOpen && <span>Scan History</span>}
//                 </Link>
//               </li>
//               <li className="mb-4 flex items-center">
//                 <Link to="/settings" className="hover:text-yellow-300 flex items-center">
//                   {isSidebarOpen ? <FaCog className="mr-2" /> : <FaCog className="mx-auto" />}
//                   {isSidebarOpen && <span>Settings</span>}
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Hamburger button */}
//         <button
//           className={`fixed top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg 
//           hover:bg-gray-700 transition-colors duration-300 ${isSidebarOpen ? 'ml-48' : ''}`}
//           onClick={toggleSidebar}
//         >
//           <FaBars size={14} />
//         </button>

//         <main className={`flex-1 bg-gray-100 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-48' : 'ml-16'}`}>
//           <Routes>
//             <Route path="/" element={<DashboardHome />} />
//             <Route path="/scan" element={<Scanner />} />
//             <Route path="/history" element={<ScanHistory />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DashboardHome from './components/DashboardHome';
import Scanner from './components/Scanner';
import ScanHistory from './components/ScanHistory';
import Settings from './components/Settings';
import './index.css';

// Import an icon library
import { FaTachometerAlt, FaClipboardCheck, FaHistory, FaCog, FaBars } from 'react-icons/fa';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };

  return (
    <Router>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white p-6 transition-transform duration-300 
          ${isSidebarOpen ? 'w-1/6' : 'w-16'} fixed top-0 left-0 h-full shadow-lg`}
        >
          <h1
            className={`text-3xl font-bold mb-8 transition-opacity duration-300 
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} text-yellow-400`}
          >
            Security Dashboard
          </h1>
          <nav>
            <ul>
              <li className="mb-4 flex items-center">
                <Link to="/" className="hover:text-yellow-300 flex items-center">
                  {isSidebarOpen ? (
                    <FaTachometerAlt className="mr-2" />
                  ) : (
                    <FaTachometerAlt className="mx-auto" />
                  )}
                  {isSidebarOpen && <span>Dashboard</span>}
                </Link>
              </li>
              <li className="mb-4 flex items-center">
                <Link to="/scan" className="hover:text-yellow-300 flex items-center">
                  {isSidebarOpen ? (
                    <FaClipboardCheck className="mr-2" />
                  ) : (
                    <FaClipboardCheck className="mx-auto" />
                  )}
                  {isSidebarOpen && <span>Scan URL</span>}
                </Link>
              </li>
              <li className="mb-4 flex items-center">
                <Link to="/history" className="hover:text-yellow-300 flex items-center">
                  {isSidebarOpen ? <FaHistory className="mr-2" /> : <FaHistory className="mx-auto" />}
                  {isSidebarOpen && <span>Scan History</span>}
                </Link>
              </li>
              <li className="mb-4 flex items-center">
                {/* <Link to="/settings" className="hover:text-yellow-300 flex items-center"> */}
                  {/* {isSidebarOpen ? <FaCog className="mr-2" /> : <FaCog className="mx-auto" />} */}
                  {/* {isSidebarOpen && <span>Settings</span>} */}
                {/* </Link> */}
              </li>
            </ul>
          </nav>
        </aside>

        {/* Hamburger button */}
        <button
          className={`fixed top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg 
          hover:bg-gray-700 transition-colors duration-300 ${isSidebarOpen ? 'ml-48' : ''}`}
          onClick={toggleSidebar}
        >
          <FaBars size={14} />
        </button>

        {/* Main content */}
        <main
          className={`flex-1 bg-gray-100 transition-all duration-300 ${
            isSidebarOpen ? 'ml-48' : 'ml-16'
          } flex justify-center items-center`}
        >
          <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg text-center">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/scan" element={<Scanner />} />
              <Route path="/history" element={<ScanHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
