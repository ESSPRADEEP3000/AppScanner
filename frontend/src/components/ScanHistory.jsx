import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const ScanHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('https://appscanner.onrender.com/api/history');
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch history', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // const generatePDF = (scan) => {
  //   const pdf = new jsPDF();
  //   pdf.setFontSize(22);
  //   pdf.text('Scan Report', 10, 10);
    
  //   // Scan details
  //   pdf.setFontSize(14);
  //   pdf.text(`URL: ${scan.url}`, 10, 30);
  //   pdf.text(`Date: ${new Date(scan.date).toLocaleDateString()}`, 10, 40);
    
  //   // Vulnerabilities section
  //   pdf.text('Vulnerabilities:', 10, 50);
    
  //   if (scan.vulnerabilities.length === 0) {
  //     pdf.text('Secure', 10, 60);
  //   } else {
  //     scan.vulnerabilities.forEach((vulnerability, index) => {
  //       const yPosition = 70 + (index * 40);  // Adjust vertical space for each vulnerability

  //       // Vulnerability Name
  //       pdf.setFontSize(14);
  //       pdf.text(`- ${vulnerability}`, 10, yPosition);

  //       // Add root cause, impact, and mitigation strategies for each vulnerability
  //       const rootCause = getRootCause(vulnerability);
  //       const impact = getImpact(vulnerability);
  //       const mitigation = getMitigation(vulnerability);

  //       pdf.setFontSize(12);
  //       pdf.text(`Root Cause: ${rootCause}`, 10, yPosition + 10);
  //       pdf.text(`Impact if Unresolved: ${impact}`, 10, yPosition + 20);
  //       pdf.text(`Mitigation: ${mitigation}`, 10, yPosition + 30);
  //     });
  //   }

  //   // Save PDF with URL as filename
  //   pdf.save(`scan-report-${scan.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  // };

  // Root Causes, Impacts, and Mitigation Strategies
  
  const generatePDF = async (scan) => {
    try {
      const response = await axios.post(
        'https://appscanner.onrender.com/api/generate-pdf',
        {
          url: scan.url,
          vulnerabilities: scan.vulnerabilities,
          date: scan.date,
        },
        { responseType: 'blob' } // Important: to handle binary data
      );

      // Trigger file download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `scan-report-${scan.url.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      downloadLink.click();

      console.log('PDF report generated and downloaded successfully.');
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  const getRootCause = (vulnerability) => {
    switch(vulnerability) {
      case 'SQL Injection vulnerability detected':
        return 'Unvalidated or unsanitized user inputs in database queries.';
      case 'XSS vulnerability detected':
        return 'Unsanitized or unescaped user inputs rendered in the browser.';
      case 'Open Redirect vulnerability detected':
        return 'Unvalidated URL redirection based on user-controlled input.';
      case 'Directory Traversal vulnerability detected':
        return 'Lack of validation or improper sanitization of file paths.';
      case 'Sensitive Information Exposure':
        return 'Exposing sensitive data such as API keys, passwords, or tokens in HTML or server responses.';
      case 'Malicious File Upload vulnerability detected':
        return 'Inadequate validation of file types or extensions during file upload.';
      case 'SSL/TLS Configuration Issue: HTTPS not used':
        return 'Missing or misconfigured SSL/TLS certificates to ensure secure communication.';
      case 'content-security-policy header missing':
        return 'Content Security Policy (CSP) header missing or incorrectly configured.';
      default:
        return 'Unknown root cause.';
    }
  };

  const getImpact = (vulnerability) => {
    switch(vulnerability) {
      case 'SQL Injection vulnerability detected':
        return 'Attackers could manipulate database queries, leading to data theft or unauthorized access.';
      case 'XSS vulnerability detected':
        return 'Attackers could inject malicious scripts into webpages, compromising user data and sessions.';
      case 'Open Redirect vulnerability detected':
        return 'Users could be redirected to malicious websites, leading to phishing or malware attacks.';
      case 'Directory Traversal vulnerability detected':
        return 'Attackers could access restricted files or directories on the server, exposing sensitive data.';
      case 'Sensitive Information Exposure':
        return 'Attackers could exploit leaked information such as passwords or API keys to gain unauthorized access.';
      case 'Malicious File Upload vulnerability detected':
        return 'Attackers could upload malicious files (e.g., executables or scripts) that could compromise the server or client systems.';
      case 'SSL/TLS Configuration Issue: HTTPS not used':
        return 'Communication between the user and server could be intercepted or altered by attackers.';
      case 'content-security-policy header missing':
        return 'Absence of a CSP header increases the risk of XSS attacks and resource injection vulnerabilities.';
      default:
        return 'Unknown impact.';
    }
  };

  const getMitigation = (vulnerability) => {
    switch(vulnerability) {
      case 'SQL Injection vulnerability detected':
        return 'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.';
      case 'XSS vulnerability detected':
        return 'Escape or sanitize all user inputs before rendering. Implement Content Security Policy (CSP) headers.';
      case 'Open Redirect vulnerability detected':
        return 'Validate all redirect URLs to ensure they are trusted or whitelist safe URLs.';
      case 'Directory Traversal vulnerability detected':
        return 'Sanitize file paths and limit access to certain directories. Use proper access control.';
      case 'Sensitive Information Exposure':
        return 'Remove sensitive information from server responses. Use environment variables for sensitive data.';
      case 'Malicious File Upload vulnerability detected':
        return 'Restrict file types allowed for upload. Implement server-side validation of file extensions and contents.';
      case 'SSL/TLS Configuration Issue: HTTPS not used':
        return 'Ensure SSL/TLS is properly configured, and all traffic is forced over HTTPS.';
      case 'content-security-policy header missing':
        return 'Implement a strict Content Security Policy (CSP) header to mitigate XSS and other injection attacks.';
      default:
        return 'No mitigation available.';
    }
  };

  if (loading) {
    return <div className="text-center text-2xl">Loading scan history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-teal-950 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-100">
      <h1 className="text-4xl font-bold mb-6">Scan History</h1>
      {history.length === 0 ? (
        <p>No previous scans available.</p>
      ) : (
        <ul className="bg-white text-black p-4 rounded-lg shadow-lg">
          {history.map((scan, index) => (
            <li key={index} className="mb-4 border-b-8 border-green-500 pb-2">
              <strong>URL:</strong> {scan.url}
              <br />
              <strong>Date:</strong> {new Date(scan.date).toLocaleDateString()}
              <br />
              <strong>Result:</strong> {scan.vulnerabilities.length === 0 ? 'Secure' : 'Vulnerabilities Found'}
              <br />
              {scan.vulnerabilities.length > 0 && (
                <ul className="mt-2">
                  {scan.vulnerabilities.map((vulnerability, i) => (
                    <li key={i} className="text-red-500">- {vulnerability}</li>
                  ))}
                </ul>
              )}
              <button 
                onClick={() => generatePDF(scan)} 
                className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-1 px-2 rounded"
              >
                Generate PDF
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScanHistory;


