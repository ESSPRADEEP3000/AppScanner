// // import { useState } from 'react';
// // import axios from 'axios';
// // import { FiLoader } from 'react-icons/fi';

// // const Scanner = () => {
// //   const [url, setUrl] = useState('');
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleScan = async () => {
// //     setLoading(true);
// //     setResult(null);
// //     try {
// //       const response = await axios.post('http://localhost:1121/api/scan', { url });
// //       setResult(response.data);
// //     } catch (error) {
// //       setResult({ error: 'Failed to scan the URL' });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-teal-950 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform">
// //       <h1 className="text-4xl font-bold mb-6">Scan a URL</h1>
// //       <div className="mb-8">
// //         <input
// //           type="text"
// //           placeholder="Enter website URL"
// //           className="border p-3 rounded-lg w-full max-w-lg text-black "
// //           value={url}
// //           onChange={(e) => setUrl(e.target.value)}
// //         />
// //         <button onClick={handleScan} className="ml-2 bg-green-500 hover:bg-green-600 text-white p-3 pr-6  rounded-lg">
// //           {loading ? <FiLoader className="animate-spin" /> : 'Scan'}
// //         </button>
// //       </div>
// //       {result && (
// //         <div className="bg-white text-black p-4 rounded-lg shadow-lg mt-6">
// //           <h2 className="text-2xl font-bold mb-4">Scan Results</h2>
// //           {result.error ? (
// //             <p className="text-red-500">{result.error}</p>
// //           ) : (
// //             <pre>{JSON.stringify(result, null, 2)}</pre>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Scanner;

// import { useState } from 'react';
// import axios from 'axios';
// import { FiLoader } from 'react-icons/fi';

// const Scanner = () => {
//   const [url, setUrl] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleScan = async () => {
//     if (!url.trim()) return;
//     setLoading(true);
//     setResult(null);
//     try {
//       const response = await axios.post('http://localhost:1121/api/scan', { url });
//       setResult(response.data);
//     } catch (error) {
//       setResult({ error: 'Failed to scan the URL' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-teal-900 to-teal-800 p-8 flex items-center justify-center">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 transition-transform transform hover:scale-[1.01]">
//         <h1 className="text-3xl md:text-4xl font-bold text-teal-900 mb-6 text-center">
//           🌐 URL Security Scanner
//         </h1>

//         <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="https://example.com"
//             className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <button
//             onClick={handleScan}
//             className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <FiLoader className="animate-spin" />
//                 Scanning...
//               </>
//             ) : (
//               'Scan'
//             )}
//           </button>
//         </div>

//         {result && (
//           <div className="mt-6 animate-fade-in-down">
//             <h2 className="text-2xl font-semibold text-teal-800 mb-3">🔍 Scan Results</h2>
//             <div className="bg-gray-100 rounded-lg p-5 overflow-x-auto shadow-inner">
//               {/* {result.error ? (
//                 <p className="text-red-600 font-medium">{result.error}</p>
//               ) : (
//                 <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
//                   {JSON.stringify(result, null, 2)}
//                 </pre>
//               )} */}
//               {result.error ? (
//                 <div className="flex items-start gap-3 p-4 bg-red-100 border border-red-300 rounded-lg shadow text-red-800">
//                   <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"
//                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round"
//                       d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"></path>
//                   </svg>
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">Scan Failed</h3>
//                     <p className="text-sm">{result.error}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
//                   {JSON.stringify(result, null, 2)}
//                 </pre>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Scanner;


// import { useState } from 'react';
// import axios from 'axios';
// import { FiLoader } from 'react-icons/fi';

// const Scanner = () => {
//   const [url, setUrl] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleScan = async () => {
//     setLoading(true);
//     setResult(null);
//     try {
//       const response = await axios.post('http://localhost:1121/api/scan', { url });
//       setResult(response.data);
//     } catch (error) {
//       setResult({ error: 'Failed to scan the URL. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-teal-950 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform max-w-3xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">🔍 Scan a URL</h1>
//       <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
//         <input
//           type="text"
//           placeholder="Enter website URL"
//           className="border p-3 rounded-lg w-full max-w-lg text-black"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button
//           onClick={handleScan}
//           disabled={loading || !url}
//           className="bg-green-500 hover:bg-green-600 text-white p-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
//         >
//           {loading ? <FiLoader className="animate-spin" /> : 'Scan'}
//         </button>
//       </div>

//       {result && (
//         <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-4">
//           {result.error ? (
//             <div className="bg-red-100 text-red-700 p-4 rounded-md border-l-4 border-red-500">
//               <h2 className="font-bold text-lg">❌ Error</h2>
//               <p>{result.error}</p>
//             </div>
//           ) : (
//             <>
//               <div className="text-xl font-semibold text-green-700">✅ {result.message}</div>

//               {result.vulnerabilities.length === 0 ? (
//                 <p className="text-green-600">No vulnerabilities were detected. 🎉</p>
//               ) : (
//                 <div className="space-y-3">
//                   <h3 className="text-lg font-bold text-red-600">Detected Vulnerabilities:</h3>
//                   <ul className="grid gap-3">
//                     {result.vulnerabilities.map((vuln, index) => (
//                       <li key={index} className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 shadow-sm">
//                         <span className="font-semibold">#{index + 1}:</span> {vuln}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scanner;

// import { useState } from 'react';
// import axios from 'axios';
// import { FiLoader } from 'react-icons/fi';

// const Scanner = () => {
//   const [url, setUrl] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleScan = async () => {
//     setLoading(true);
//     setResult(null);
//     try {
//       const response = await axios.post('http://localhost:1121/api/scan', { url });
//       setResult(response.data);
//     } catch (error) {
//       setResult({ error: 'Failed to scan the URL. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-teal-950 text-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto mt-12 hover:shadow-2xl transition-transform transform hover:scale-[1.01]">
//       <h1 className="text-4xl font-bold mb-6 text-center">🔍 URL Security Scanner</h1>
      
//       <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
//         <input
//           type="text"
//           placeholder="https://example.com"
//           className="w-full p-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <button
//           onClick={handleScan}
//           disabled={loading || !url.trim()}
//           className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
//         >
//           {loading ? <FiLoader className="animate-spin" /> : 'Scan'}
//         </button>
//       </div>

//       {result && (
//         <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-6 animate-fade-in-down">
//           {result.error ? (
//             <div className="bg-red-50 border border-red-300 rounded-lg p-5 space-y-3">
//               <h2 className="text-red-600 text-2xl font-semibold flex items-center gap-2">
//                 ❌ Scan Failed
//               </h2>
//               <div className="grid sm:grid-cols-2 gap-4 text-red-800 text-sm">
//                 {Object.entries(result).map(([key, value]) => (
//                   <div key={key} className="flex flex-col">
//                     <span className="font-semibold capitalize">{key}</span>
//                     <span className="bg-red-100 px-3 py-1 rounded-lg border border-red-200">
//                       {value.toString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="text-green-700 text-2xl font-semibold flex items-center gap-2">
//                 ✅ {result.message}
//               </div>

//               {result.vulnerabilities.length === 0 ? (
//                 <p className="text-green-600 text-lg">No vulnerabilities were detected. 🎉</p>
//               ) : (
//                 <div className="space-y-3">
//                   <h3 className="text-red-600 text-xl font-bold">Detected Vulnerabilities:</h3>
//                   <ul className="grid gap-3">
//                     {result.vulnerabilities.map((vuln, idx) => (
//                       <li
//                         key={idx}
//                         className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 shadow-sm flex items-start gap-3"
//                       >
//                         <span className="font-bold">#{idx + 1}</span>
//                         <span>{vuln}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scanner;


import { useState } from 'react';
import axios from 'axios';
import { FiLoader, FiDownload } from 'react-icons/fi';

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:1121/api/scan', { url });
      // include a timestamp so our PDF knows when this scan ran
      setResult({ ...response.data, scannedAt: new Date().toISOString() });
    } catch (error) {
      setResult({ error: 'Failed to scan the URL. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result || result.error) return;
    setPdfLoading(true);
    try {
      const payload = {
        url,
        vulnerabilities: result.vulnerabilities,
        date: result.scannedAt
      };
      const response = await axios.post(
        'http://localhost:1121/api/generate-pdf',
        payload,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      link.click();
    } catch (err) {
      console.error('PDF download failed', err);
      alert('Could not download report. Try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="bg-teal-950 text-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto mt-12 hover:shadow-2xl transition-transform transform hover:scale-[1.01]">
      <h1 className="text-4xl font-bold mb-6 text-center">🔍 URL Security Scanner</h1>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="https://example.com"
          className="w-full p-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleScan}
          disabled={loading || !url.trim()}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : 'Scan'}
        </button>
      </div>

      {result && (
        <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-6 animate-fade-in-down">
          {result.error ? (
            <div className="bg-red-50 border border-red-300 rounded-lg p-5 space-y-3">
              <h2 className="text-red-600 text-2xl font-semibold flex items-center gap-2">
                ❌ Scan Failed
              </h2>
              <p className="text-red-800">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-green-700 text-2xl font-semibold">✅ {result.message}</span>
                <button
                  onClick={downloadReport}
                  disabled={pdfLoading}
                  className="ml-auto flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {pdfLoading
                    ? <FiLoader className="animate-spin" />
                    : <>Download Report <FiDownload /></>}
                </button>
              </div>

              {result.vulnerabilities.length === 0 ? (
                <p className="text-green-600 text-lg">No vulnerabilities were detected. 🎉</p>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-red-600 text-xl font-bold">Detected Vulnerabilities:</h3>
                  <ul className="grid gap-3">
                    {result.vulnerabilities.map((vuln, idx) => (
                      <li
                        key={idx}
                        className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 shadow-sm flex items-start gap-3"
                      >
                        <span className="font-bold">#{idx + 1}</span>
                        <span>{vuln}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
