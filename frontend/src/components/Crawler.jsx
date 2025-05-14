// import { useState } from 'react';
// import axios from 'axios';
// import { FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';

// export default function Crawler() {
//   const [url, setUrl] = useState('');
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [openIdx, setOpenIdx] = useState(-1);

//   const runCrawl = async () => {
//     setLoading(true);
//     setData(null);
//     try {
//       const resp = await axios.post('http://localhost:1121/api/crawl', { url });
//       setData(resp.data.pages);
//     } catch (err) {
//       alert('Crawl failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-2xl shadow-lg mt-12">
//       <h1 className="text-3xl font-bold mb-6">🌐 App Crawler & XSS Tester</h1>

//       <div className="flex gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="https://example.com"
//           className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//           value={url}
//           onChange={e => setUrl(e.target.value)}
//         />
//         <button
//           onClick={runCrawl}
//           disabled={loading || !url.trim()}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
//         >
//           {loading ? <FiLoader className="animate-spin" /> : 'Discover & Test'}
//         </button>
//       </div>

//       {data?.length === 0 && (
//         <p className="text-center text-gray-600">No pages with inputs found.</p>
//       )}

//       <div className="space-y-4">
//         {data?.map((page, i) => (
//           <div key={i} className="border rounded-lg overflow-hidden">
//             <button
//               onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
//               className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
//             >
//               <span className="font-medium">{page.url}</span>
//               <span className="text-sm text-gray-600">
//                 {page.inputs.length} input(s)
//               </span>
//             </button>

//             {openIdx === i && (
//               <div className="p-4 bg-white space-y-4">
//                 {page.inputs.map((field, idx) => {
//                   const results = page.xssResults
//                     .filter(r => r.field === field.name);

//                   return (
//                     <div key={idx} className="space-y-2">
//                       <h4 className="font-semibold">
//                         Field “<span className="font-mono">{field.name || '(no name)'}</span>” ({field.tag})
//                       </h4>
//                       <pre className="bg-gray-100 rounded p-2 text-sm overflow-auto">
//                         {field.snippet}
//                       </pre>
//                       <table className="w-full text-left border-collapse">
//                         <thead>
//                           <tr>
//                             <th className="border-b px-2 py-1">Payload</th>
//                             <th className="border-b px-2 py-1">Result</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {results.map((r,j) => (
//                             <tr key={j}>
//                               <td className="border px-2 py-1 font-mono truncate">{r.payload}</td>
//                               <td className="border px-2 py-1">
//                                 {r.detected ? '✅' : '❌'}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
// );
// }



// Crawler.jsx

import { useState } from 'react';
import axios from 'axios';
import { FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';

export default function Crawler() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState(-1);

  const runCrawl = async () => {
    setLoading(true);
    setData(null);
    try {
      const resp = await axios.post('https://appscanner.onrender.com/api/crawl', { url });
      setData(resp.data.pages);
    } catch {
      alert('Crawl failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-2xl shadow-lg mt-12">
      <h1 className="text-3xl font-bold mb-6">🌐 App Crawler & XSS Tester</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="https://example.com"
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          onClick={runCrawl}
          disabled={loading || !url.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : 'Discover & Test'}
        </button>
      </div>

      {data?.length === 0 && (
        <p className="text-center text-gray-600">No pages with inputs found.</p>
      )}

      <div className="space-y-4">
        {data?.map((page, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
            >
              <span className="font-medium">{page.url}</span>
              <span className="text-sm text-gray-600">
                {page.inputs.length} input(s)
              </span>
              {openIdx === i ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {openIdx === i && (
              <div className="p-4 bg-white space-y-6">
                {page.inputs.map((field, idx) => {
                  const results = page.xssResults.filter(r => r.fieldIndex === field.index);
                  return (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-semibold">
                        Field #{field.index + 1}{' '}
                        {field.name ? `“${field.name}”` : '(no name)'} ({field.tag})
                      </h4>
                      <pre className="bg-gray-100 rounded p-2 text-sm overflow-auto">
                        {field.snippet}
                      </pre>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className="border-b px-2 py-1">Payload</th>
                            <th className="border-b px-2 py-1">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r, j) => (
                            <tr key={j}>
                              <td className="border px-2 py-1 font-mono truncate">
                                {r.payload}
                              </td>
                              <td className="border px-2 py-1">
                                {r.detected ? '✅' : '❌'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
