// // CrawlHistory.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';

// export default function CrawlHistory() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openIdx, setOpenIdx] = useState(-1);

//   useEffect(() => {
//     axios.get('http://localhost:1121/api/crawl-history')
//       .then(resp => setHistory(resp.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading crawl history…</div>;
//   if (!history.length) return <div>No crawl history found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
//       <h2 className="text-2xl font-bold mb-4">Crawl History</h2>
//       {history.map((run, i) => (
//         <div key={run._id} className="border mb-4 rounded overflow-hidden">
//           <button
//             onClick={() => setOpenIdx(openIdx===i ? -1 : i)}
//             className="w-full flex justify-between p-3 bg-gray-100"
//           >
//             <span>{run.url} (depth {run.depth})</span>
//             <span>{new Date(run.date).toLocaleString()}</span>
//             {openIdx===i ? <FiChevronUp/> : <FiChevronDown/>}
//           </button>
//           {openIdx===i && (
//             <div className="p-4 bg-white space-y-4">
//               {run.pages.map((page,j) => (
//                 <div key={j} className="p-3 border rounded">
//                   <strong>Page:</strong> {page.url}<br/>
//                   <strong>Inputs:</strong> {page.inputs.length}<br/>
//                   <strong>Vulnerabilities:</strong> {page.xssResults.some(r=>r.detected) 
//                     ? 'Some payloads reflected ❌' 
//                     : 'No payloads reflected ✅'}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



// CrawlHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function CrawlHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRunIdx, setOpenRunIdx] = useState(-1);
  const [openPageIdx, setOpenPageIdx] = useState({}); // { [runIdx]: pageIdx }

  useEffect(() => {
    axios.get('https://appscanner.onrender.com/crawl-history')
      .then(resp => setHistory(resp.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading crawl history…</div>;
  if (!history.length) return <div>No crawl history found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Crawl History</h2>
      {history.map((run, i) => (
        <div key={run._id} className="border mb-4 rounded overflow-hidden">
          <button
            onClick={() => setOpenRunIdx(openRunIdx === i ? -1 : i)}
            className="w-full flex justify-between p-3 bg-gray-100"
          >
            <span>{run.url} (depth {run.depth})</span>
            <span>{new Date(run.date).toLocaleString()}</span>
            {openRunIdx === i ? <FiChevronUp/> : <FiChevronDown/>}
          </button>

          {openRunIdx === i && (
            <div className="p-4 bg-white space-y-4">
              {run.pages.map((page, j) => (
                <div key={j} className="border rounded overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenPageIdx(prev => ({
                        ...prev,
                        [i]: prev[i] === j ? -1 : j
                      }))
                    }
                    className="w-full flex justify-between p-3 bg-gray-50"
                  >
                    <span className="font-medium">{page.url}</span>
                    <span className="text-sm text-gray-600">
                      {page.inputs.length} input(s)
                    </span>
                    {openPageIdx[i] === j ? <FiChevronUp/> : <FiChevronDown/>}
                  </button>

                  {openPageIdx[i] === j && (
                    <div className="p-4 bg-white space-y-4">
                      {page.inputs.map((field, idx) => {
                        const results = page.xssResults.filter(
                          r => r.fieldIndex === field.index
                        );
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
                                {results.map((r, k) => (
                                  <tr key={k}>
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
          )}
        </div>
      ))}
    </div>
  );
}
