// // const express = require('express');
// // const cors = require('cors');
// // const axios = require('axios');
// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');
// // const helmet = require('helmet');
// // const morgan = require('morgan');
// // const rateLimit = require('express-rate-limit');
// // const ScanResult = require('./models/scanResult.js');
// // const PDFDocument = require('pdfkit');
// // const fs = require('fs');
// // const { URL }       = require('url');
// // const dns           = require('dns').promises;
// // const Joi           = require('joi');
// // const app = express();
// // app.use(cors());
// // // Body size limit to prevent huge payloads
// // app.use(bodyParser.json({ limit: '10kb' }));
// // app.use(helmet()); // Security headers
// // app.use(morgan('combined')); // Logging HTTP requests

// // // MongoDB connection
// // mongoose.connect('mongodb+srv://eyyunnisaisrinivasapradeep:b6Y80dGtfR12UPcA@cluster1.xz9wb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
// // ).then(() => console.log('Connected to MongoDB'))
// //   .catch(err => console.log('MongoDB connection error:', err));

// // // Rate limiting
// // const limiter = rateLimit({
// //     windowMs: 10 * 60 * 1000, // 10 minutes
// //     max: 5, // Limit each IP to 5 requests per window
// //     message: "Too many requests, please try again later."
// // });
// // app.use(limiter);

// // const validateUrl = async (req, res, next) => {
// //     const schema = Joi.object({
// //       url: Joi.string().uri({ scheme: [/https?/] }).required()
// //     });
// //     const { error, value } = schema.validate(req.body);
// //     if (error) return res.status(400).json({ error: 'Invalid URL format' });

// //     try {
// //       const hostname = new URL(value.url).hostname;
// //       const addrs = await dns.lookup(hostname, { all: true });
// //       // Reject private IPs (10.x.x.x, 192.168.x.x, 127.x.x.x, etc.)
// //       for (let { address } of addrs) {
// //         if (
// //           address.startsWith('10.') ||
// //           address.startsWith('192.168.') ||
// //           address.startsWith('127.') ||
// //           address.startsWith('172.16.')
// //         ) {
// //           return res.status(400).json({ error: 'URL resolves to a private or loopback address' });
// //         }
// //       }
// //     } catch {
// //       return res.status(400).json({ error: 'Unable to resolve hostname' });
// //     }

// //     req.safeUrl = value.url;
// //     next();
// //   };
// //   const http = axios.create({
// //     timeout: 5000,
// //     maxRedirects: 0,
// //     maxContentLength: 1_000_000
// //   });

// // // Define payloads and headers for OWASP checks
// // const sqlPayloads = ["' OR '1'='1", "' OR 'a'='a"];
// // const xssPayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
// // const directoryTraversalPayloads = ['../etc/passwd', '../../etc/shadow'];
// // const openRedirectPayload = '/redirect?url=https://evil.com';
// // const sensitiveKeywords = ['api_key', 'password', 'secret', 'token'];
// // const requiredHeaders = ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy"];

// // // SSL/TLS Check function
// // const checkSSL = (url) => url.startsWith('https');
// // app.post('/api/scan', validateUrl, async (req, res) => {
// //     const url = req.safeUrl;
// //     const vulnerabilities = [];

// //     // (Your payload arrays here…)
// //     const sqlPayloads              = ["' OR '1'='1", "' OR 'a'='a"];
// //     const xssPayloads              = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
// //     const dirTraversalPayloads     = ['../etc/passwd', '../../etc/shadow'];
// //     const openRedirectPayload      = '/redirect?url=https://evil.com';
// //     const sensitiveKeywords        = ['api_key','password','secret','token'];
// //     const requiredHeaders          = ["content-security-policy","strict-transport-security","x-content-type-options","x-frame-options","referrer-policy"];
// //     const checkSSL                 = u => u.startsWith('https');

// //     // Helper: safely fetch and return `.data` (or empty string on error)
// //     const fetchData = async (target) => {
// //       try {
// //         const resp = await http.get(target);
// //         return { data: resp.data, headers: resp.headers, finalUrl: resp.request?.res?.responseUrl };
// //       } catch {
// //         return { data: '', headers: {}, finalUrl: null };
// //       }
// //     };

// //     // ── SQL Injection
// //     for (let p of sqlPayloads) {
// //       const { data } = await fetchData(`${url}?id=${encodeURIComponent(p)}`);
// //       if (/SQL syntax|SQL error/i.test(data)) {
// //         vulnerabilities.push('SQL Injection vulnerability detected');
// //         break;
// //       }
// //     }

// //     // ── XSS
// //     for (let p of xssPayloads) {
// //       const { data } = await fetchData(`${url}?q=${encodeURIComponent(p)}`);
// //       if (data.includes(p)) {
// //         vulnerabilities.push('XSS vulnerability detected');
// //         break;
// //       }
// //     }

// //     // ── Open Redirect
// //     {
// //       const { finalUrl } = await fetchData(`${url}${openRedirectPayload}`);
// //       if (finalUrl?.includes('evil.com')) {
// //         vulnerabilities.push('Open Redirect vulnerability detected');
// //       }
// //     }

// //     // ── Directory Traversal
// //     for (let p of dirTraversalPayloads) {
// //       const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
// //       if (data.includes('root:') || data.includes('shadow:')) {
// //         vulnerabilities.push('Directory Traversal vulnerability detected');
// //         break;
// //       }
// //     }

// //     // ── Sensitive Info & Header checks
// //     {
// //       const { data, headers } = await fetchData(url);
// //       const lc = data.toLowerCase();
// //       sensitiveKeywords.forEach(k => {
// //         if (lc.includes(k)) vulnerabilities.push(`Sensitive Information Exposure: ${k} found`);
// //       });
// //       requiredHeaders.forEach(h => {
// //         if (!headers[h]) vulnerabilities.push(`${h} header missing`);
// //       });
// //     }

// //     // ── SSL/TLS Check
// //     if (!checkSSL(url)) {
// //       vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');
// //     }

// //     // ── Persist to Mongo
// //     await new ScanResult({ url, vulnerabilities, date: new Date() }).save();

// //     return res.json({ message: 'Scan completed', vulnerabilities });
// //   });


// //   /**
// //    * ══ ➏ HISTORY & PDF ROUTES (unchanged from your secure-piping version) ══
// //    */
// //   app.get('/api/history', /* … */);
// //   app.post('/api/generate-pdf', /* … */);

// // // Security scanning route
// // app.post('/api/scan', async (req, res) => {
// //     const { url } = req.body;
// //     if (!url) return res.status(400).json({ error: 'URL is required' });

// //     try {
// //         const vulnerabilities = [];

// //         // SQL Injection Check
// //         for (let payload of sqlPayloads) {
// //             try {
// //                 const testUrl = `${url}?id=${payload}`;
// //                 const response = await axios.get(testUrl);
// //                 if (response.data.includes('error in your SQL')) {
// //                     vulnerabilities.push('SQL Injection vulnerability detected');
// //                     break;
// //                 }
// //             } catch (err) {
// //                 console.error(`SQL Injection Check failed for payload: ${payload}`);
// //             }
// //         }

// //         // XSS Check
// //         for (let payload of xssPayloads) {
// //             try {
// //                 const response = await axios.get(`${url}?q=${encodeURIComponent(payload)}`);
// //                 if (response.data.includes(payload)) {
// //                     vulnerabilities.push('XSS vulnerability detected');
// //                     break;
// //                 }
// //             } catch (err) {
// //                 console.error(`XSS Check failed for payload: ${payload}`);
// //             }
// //         }

// //         // Open Redirect Check
// //         try {
// //             const response = await axios.get(`${url}${openRedirectPayload}`);
// //             if (response.request.res.responseUrl.includes('evil.com')) {
// //                 vulnerabilities.push('Open Redirect vulnerability detected');
// //             }
// //         } catch (err) {
// //             console.error('Open Redirect Check failed:', err.message);
// //         }

// //         // Directory Traversal Check
// //         for (let payload of directoryTraversalPayloads) {
// //             try {
// //                 const response = await axios.get(`${url}/${payload}`);
// //                 if (response.status === 200) {
// //                     vulnerabilities.push('Directory Traversal vulnerability detected');
// //                     break;
// //                 }
// //             } catch (err) {
// //                 console.error(`Directory Traversal Check failed for payload: ${payload}`);
// //             }
// //         }

// //         // Sensitive Information Exposure Check
// //         try {
// //             const pageContent = await axios.get(url);
// //             for (let keyword of sensitiveKeywords) {
// //                 if (pageContent.data.toLowerCase().includes(keyword)) {
// //                     vulnerabilities.push(`Sensitive Information Exposure: ${keyword} found`);
// //                 }
// //             }

// //             // Header Check
// //             for (let header of requiredHeaders) {
// //                 if (!pageContent.headers[header.toLowerCase()]) {
// //                     vulnerabilities.push(`${header} header missing`);
// //                 }
// //             }
// //         } catch (err) {
// //             console.error('Sensitive Information Check failed:', err.message);
// //         }

// //         // SSL/TLS Check
// //         if (!checkSSL(url)) {
// //             vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');
// //         }

// //         // Save scan result
// //         const newScan = new ScanResult({
// //             url,
// //             vulnerabilities,
// //             date: new Date()
// //         });
// //         await newScan.save();

// //         res.json({ message: 'Scan completed', vulnerabilities });
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // // Route to fetch scan history
// // app.get('/api/history', async (req, res) => {
// //     try {
// //         const history = await ScanResult.find().sort({ date: -1 });
// //         res.json(history);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // // Route to generate PDF report
// // // app.post('/api/generate-pdf', async (req, res) => {
// // //     const { url, vulnerabilities, date } = req.body;

// // //     if (!url || !vulnerabilities || !date) {
// // //         return res.status(400).json({ error: 'Missing required data for PDF generation' });
// // //     }

// // //     try {
// // //         // Create a new PDF document
// // //         const doc = new PDFDocument();
// // //         const filePath = `./reports/Scan_Report_${Date.now()}.pdf`;

// // //         // Pipe the document to a file
// // //         doc.pipe(fs.createWriteStream(filePath));

// // //         // Add Title
// // //         doc.fontSize(20).text('Web Application Vulnerability Scan Report', { align: 'center' });
// // //         doc.moveDown();

// // //         // Add Metadata
// // //         doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
// // //         doc.text(`Target URL: ${url}`);
// // //         doc.moveDown();

// // //         // Add Vulnerabilities Section
// // //         doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
// // //         if (vulnerabilities.length === 0) {
// // //             doc.fontSize(12).text('No vulnerabilities were detected.');
// // //         } else {
// // //             vulnerabilities.forEach((vulnerability, index) => {
// // //                 doc.fontSize(12).text(`${index + 1}. ${vulnerability}`);
// // //             });
// // //         }
// // //         doc.moveDown();

// // //         // Add Recommendations Section
// // //         doc.fontSize(16).text('Recommendations for Mitigation:', { underline: true });
// // //         doc.fontSize(12).text(`
// // //         - SQL Injection: Use parameterized queries and input validation to prevent injection.
// // //         - XSS: Sanitize all user inputs and use Content Security Policy (CSP).
// // //         - Open Redirects: Validate all redirects and ensure they point to trusted domains.
// // //         - Directory Traversal: Validate file paths and restrict access to specific directories.
// // //         - Sensitive Information: Avoid exposing sensitive data in responses; use environment variables.
// // //         - SSL/TLS: Always use HTTPS and enable strong ciphers for secure communication.
// // //         `);
// // //         doc.moveDown();

// // //         // Add Footer
// // //         doc.fontSize(10).text('Generated by Web Application Vulnerability Scanner', { align: 'center' });

// // //         // Finalize the document
// // //         doc.end();

// // //         res.json({ message: 'PDF report generated successfully', filePath });
// // //     } catch (err) {
// // //         console.error('Error generating PDF:', err.message);
// // //         res.status(500).json({ error: 'Failed to generate PDF' });
// // //     }
// // // });
// // // Route to generate PDF report
// // // app.post('/api/generate-pdf', async (req, res) => {
// // //     const { url, vulnerabilities, date } = req.body;

// // //     if (!url || !vulnerabilities || !date) {
// // //       return res.status(400).json({ error: 'Missing required data for PDF generation' });
// // //     }

// // //     try {
// // //       // Create a new PDF document
// // //       const doc = new PDFDocument({ margin: 50, size: 'A4' });

// // //       // Set headers so the browser downloads it
// // //       res.setHeader('Content-Type', 'application/pdf');
// // //       res.setHeader(
// // //         'Content-Disposition',
// // //         `attachment; filename="scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf"`
// // //       );

// // //       // Pipe directly to the response
// // //       doc.pipe(res);

// // //       // Title
// // //       doc
// // //         .fontSize(20)
// // //         .text('Web Application Vulnerability Scan Report', { align: 'center' })
// // //         .moveDown();

// // //       // Metadata
// // //       doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
// // //       doc.text(`Target URL: ${url}`).moveDown();

// // //       // Vulnerabilities
// // //       doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
// // //       if (vulnerabilities.length === 0) {
// // //         doc.fontSize(12).text('No vulnerabilities were detected.');
// // //       } else {
// // //         vulnerabilities.forEach((vuln, idx) => {
// // //           doc
// // //             .fontSize(12)
// // //             .text(`${idx + 1}. ${vuln}`)
// // //             .moveDown(0.2);
// // //         });
// // //       }
// // //       doc.moveDown();

// // //       // Recommendations
// // //       doc.fontSize(16).text('Recommendations for Mitigation:', { underline: true });
// // //       doc
// // //         .fontSize(12)
// // //         .list([
// // //           'SQL Injection: Use parameterized queries and input validation to prevent injection.',
// // //           'XSS: Sanitize all user inputs and use a Content Security Policy (CSP).',
// // //           'Open Redirects: Validate all redirects against a whitelist of trusted domains.',
// // //           'Directory Traversal: Validate file paths and restrict directory access.',
// // //           'Sensitive Info: Avoid exposing keys/secrets; use environment variables.',
// // //           'SSL/TLS: Force HTTPS and enable strong ciphers.'
// // //         ])
// // //         .moveDown();

// // //       // Footer
// // //       doc
// // //         .fontSize(10)
// // //         .text('Generated by Web Application Vulnerability Scanner', { align: 'center' });

// // //       // Finalize PDF (this will flush the stream and end the response)
// // //       doc.end();

// // //     } catch (err) {
// // //       console.error('Error generating PDF:', err);
// // //       // If headers already sent, you can’t send JSON—just end.
// // //       if (!res.headersSent) {
// // //         res.status(500).json({ error: 'Failed to generate PDF' });
// // //       } else {
// // //         res.end();
// // //       }
// // //     }
// // //   });
// //   // Route to generate PDF report with targeted recommendations
// // app.post('/api/generate-pdf', async (req, res) => {
// //     const { url, vulnerabilities, date } = req.body;

// //     if (!url || !vulnerabilities || !date) {
// //       return res.status(400).json({ error: 'Missing required data for PDF generation' });
// //     }

// //     // Helper to map each vulnerability to its mitigation text
// //     const mitigationMap = {
// //       'SQL Injection vulnerability detected':
// //         'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.',
// //       'XSS vulnerability detected':
// //         'Escape or sanitize all user inputs before rendering. Implement a strong Content Security Policy (CSP).',
// //       'Open Redirect vulnerability detected':
// //         'Validate all redirect URLs against a whitelist of trusted domains.',
// //       'Directory Traversal vulnerability detected':
// //         'Sanitize file paths and enforce strict access controls on directories.',
// //       'Sensitive Information Exposure: api_key found':
// //         'Remove sensitive data from responses; use environment variables and secrets management.',
// //       'SSL/TLS Configuration Issue: HTTPS not used':
// //         'Enable HTTPS everywhere; redirect all HTTP traffic to HTTPS with strong ciphers.',
// //       'content-security-policy header missing':
// //         'Add a strict Content-Security-Policy header to mitigate XSS and resource injection.'
// //       // …add more mappings as needed…
// //     };

// //     try {
// //       const doc = new PDFDocument({ margin: 50, size: 'A4' });

// //       // Stream PDF to response
// //       res.setHeader('Content-Type', 'application/pdf');
// //       res.setHeader(
// //         'Content-Disposition',
// //         `attachment; filename="scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf"`
// //       );
// //       doc.pipe(res);

// //       // Title & Metadata
// //       doc.fontSize(20).text('Web App Vulnerability Scan Report', { align: 'center' }).moveDown();
// //       doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
// //       doc.text(`Target URL: ${url}`).moveDown();

// //       // List detected vulnerabilities
// //       doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
// //       if (vulnerabilities.length === 0) {
// //         doc.fontSize(12).text('No vulnerabilities were detected.');
// //       } else {
// //         vulnerabilities.forEach((vuln, i) => {
// //           doc.fontSize(12).text(`${i + 1}. ${vuln}`).moveDown(0.2);
// //         });
// //       }
// //       doc.moveDown();

// //       // Only include mitigations for detected items
// //       if (vulnerabilities.length > 0) {
// //         doc.fontSize(16).text('Mitigation Recommendations:', { underline: true });

// //         // Build a unique list of relevant recommendations
// //         const seen = new Set();
// //         for (const vuln of vulnerabilities) {
// //           const rec = mitigationMap[vuln];
// //           if (rec && !seen.has(rec)) {
// //             seen.add(rec);
// //             doc.fontSize(12).list([rec]).moveDown(0.5);
// //           }
// //         }
// //       }

// //       // Footer
// //       doc.moveDown();
// //       doc.fontSize(10).text('Generated by Web App Vulnerability Scanner', { align: 'center' });

// //       doc.end();
// //     } catch (err) {
// //       console.error('Error generating PDF:', err);
// //       if (!res.headersSent) {
// //         res.status(500).json({ error: 'Failed to generate PDF' });
// //       } else {
// //         res.end();
// //       }
// //     }
// //   });

// // // Start server
// // const PORT = 1121;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // server.js

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const { URL } = require('url');
// const dns = require('dns').promises;
// const Joi = require('joi');
// const ScanResult = require('./models/scanResult.js');
// const PDFDocument = require('pdfkit');

// const app = express();

// /** ── GLOBAL MIDDLEWARE ──────────────────────────────────────────────── */
// // CORS — restrict to frontend origin
// app.use(cors({}));
// // Body parser with size limit
// app.use(bodyParser.json({ limit: '10kb' }));
// // Security headers
// app.use(helmet());
// // HTTP request logging
// app.use(morgan('combined'));
// // Rate limiting
// app.use(rateLimit({
//     windowMs: 10 * 60 * 1000,
//     max: 5,
//     message: 'Too many requests, please try again later.'
// }));

// /** ── DATABASE CONNECTION ───────────────────────────────────────────── */
// mongoose.connect(
//     'mongodb+srv://eyyunnisaisrinivasapradeep:b6Y80dGtfR12UPcA@cluster1.xz9wb.mongodb.net/?retryWrites=true&w=majority',
//     { appName: 'Cluster1' }
// )
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

// /** ── SSRF PROTECTION & URL VALIDATION ───────────────────────────────── */
// const validateUrl = async (req, res, next) => {
//     const schema = Joi.object({
//         url: Joi.string().uri({ scheme: [/https?/] }).required()
//     });
//     const { error, value } = schema.validate(req.body);
//     if (error) return res.status(400).json({ error: 'Invalid URL format' });

//     try {
//         const hostname = new URL(value.url).hostname;
//         const addrs = await dns.lookup(hostname, { all: true });
//         for (let { address } of addrs) {
//             if (
//                 address.startsWith('10.') ||
//                 address.startsWith('192.168.') ||
//                 address.startsWith('127.') ||
//                 address.startsWith('172.16.')
//             ) {
//                 return res.status(400).json({ error: 'URL resolves to a private or loopback address' });
//             }
//         }
//     } catch {
//         return res.status(400).json({ error: 'Unable to resolve hostname' });
//     }

//     req.safeUrl = value.url;
//     next();
// };

// /** ── AXIOS INSTANCE WITH RESTRICTIONS ───────────────────────────────── */
// const http = axios.create({
//     timeout: 5000,
//     maxRedirects: 0,
//     maxContentLength: 1_000_000
// });

// /** ── SECURITY SCANNER ROUTE ─────────────────────────────────────────── */
// app.post('/api/scan', validateUrl, async (req, res) => {
//     const url = req.safeUrl;
//     const vulnerabilities = [];

//     // Payloads & checks
//     const sqlPayloads = ["' OR '1'='1", "' OR 'a'='a"];
//     const xssPayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
//     const dirTraversalPayloads = ['../etc/passwd', '../../etc/shadow'];
//     const openRedirectPayload = '/redirect?url=https://evil.com';
//     const sensitiveKeywords = ['api_key', 'password', 'secret', 'token'];
//     const requiredHeaders = [
//         'content-security-policy',
//         'strict-transport-security',
//         'x-content-type-options',
//         'x-frame-options',
//         'referrer-policy'
//     ];
//     const isHttps = u => u.startsWith('https');

//     // Helper to fetch safely
//     const fetchData = async (target) => {
//         try {
//             const resp = await http.get(target);
//             return { data: resp.data, headers: resp.headers, finalUrl: resp.request?.res?.responseUrl };
//         } catch {
//             return { data: '', headers: {}, finalUrl: null };
//         }
//     };

//     // ── SQL Injection
//     for (let p of sqlPayloads) {
//         const { data } = await fetchData(`${url}?id=${encodeURIComponent(p)}`);
//         if (/SQL syntax|SQL error/i.test(data)) {
//             vulnerabilities.push('SQL Injection vulnerability detected');
//             break;
//         }
//     }

//     // ── XSS
//     for (let p of xssPayloads) {
//         const { data } = await fetchData(`${url}?q=${encodeURIComponent(p)}`);
//         if (data.includes(p)) {
//             vulnerabilities.push('XSS vulnerability detected');
//             break;
//         }
//     }

//     // ── Open Redirect
//     {
//         const { finalUrl } = await fetchData(`${url}${openRedirectPayload}`);
//         if (finalUrl?.includes('evil.com')) {
//             vulnerabilities.push('Open Redirect vulnerability detected');
//         }
//     }

//     // ── Directory Traversal
//     for (let p of dirTraversalPayloads) {
//         const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
//         if (data.includes('root:') || data.includes('shadow:')) {
//             vulnerabilities.push('Directory Traversal vulnerability detected');
//             break;
//         }
//     }

//     // ── Sensitive Info & Header checks
//     {
//         const { data, headers } = await fetchData(url);
//         const lc = data.toLowerCase();
//         sensitiveKeywords.forEach(k => {
//             if (lc.includes(k)) {
//                 vulnerabilities.push(`Sensitive Information Exposure: ${k} found`);
//             }
//         });
//         requiredHeaders.forEach(h => {
//             if (!headers[h]) {
//                 vulnerabilities.push(`${h} header missing`);
//             }
//         });
//     }

//     // ── SSL/TLS Check
//     if (!isHttps(url)) {
//         vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');
//     }

//     // Persist result
//     await new ScanResult({ url, vulnerabilities, date: new Date() }).save();

//     res.json({ message: 'Scan completed', vulnerabilities });
// });

// /** ── HISTORY ROUTE ──────────────────────────────────────────────────── */
// app.get('/api/history', async (req, res) => {
//     try {
//         const history = await ScanResult.find().sort({ date: -1 });
//         res.json(history);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /** ── PDF GENERATION ROUTE ───────────────────────────────────────────── */
// app.post('/api/generate-pdf', async (req, res) => {
//     const { url, vulnerabilities, date } = req.body;
//     if (!url || !vulnerabilities || !date) {
//         return res.status(400).json({ error: 'Missing required data for PDF generation' });
//     }

//     // Map each vuln to its mitigation
//     //   const mitigationMap = {
//     //     'SQL Injection vulnerability detected':
//     //       'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.',
//     //     'XSS vulnerability detected':
//     //       'Escape or sanitize all user inputs before rendering. Implement a strong Content Security Policy (CSP).',
//     //     'Open Redirect vulnerability detected':
//     //       'Validate all redirect URLs against a whitelist of trusted domains.',
//     //     'Directory Traversal vulnerability detected':
//     //       'Sanitize file paths and enforce strict access controls on directories.',
//     //     'SSL/TLS Configuration Issue: HTTPS not used':
//     //       'Enable HTTPS everywhere; redirect all HTTP traffic to HTTPS with strong ciphers.',
//     //     // Add more mappings as needed…
//     //   };
//     // 1️⃣ Define exact mappings for fixed vulnerability strings
//     const exactMap = {
//         'SQL Injection vulnerability detected':
//             'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.',
//         'XSS vulnerability detected':
//             'Escape or sanitize all user inputs before rendering. Implement a strong Content Security Policy (CSP).',
//         'Open Redirect vulnerability detected':
//             'Validate all redirect URLs against a whitelist of trusted domains.',
//         'Directory Traversal vulnerability detected':
//             'Sanitize file paths and enforce strict access controls on directories.',
//         'SSL/TLS Configuration Issue: HTTPS not used':
//             'Enable HTTPS everywhere; redirect all HTTP traffic to HTTPS with strong ciphers.',
//     };

//     // 2️⃣ Generic mapping for any “Sensitive Information Exposure:” entry
//     const sensitiveRec =
//         'Remove sensitive data from responses; use environment variables and secrets management.';

//     // 3️⃣ Generic mapping for any “<header> header missing” entry
//     const headerRecMap = {
//         'content-security-policy':
//             'Add a strict Content-Security-Policy header to mitigate XSS and resource injection.',
//         'strict-transport-security':
//             'Implement HSTS to force browsers to use HTTPS.',
//         'x-content-type-options':
//             'Add X-Content-Type-Options: nosniff to prevent MIME sniffing.',
//         'x-frame-options':
//             'Add X-Frame-Options to prevent clickjacking.',
//         'referrer-policy':
//             'Add a Referrer-Policy header to control referrer leakage.'
//     };

//     // … later, after you’ve listed vulnerabilities …

//     // Only include mitigations for detected items
//     if (vulnerabilities.length > 0) {
//         doc.fontSize(16).text('Mitigation Recommendations:', { underline: true });

//         const seen = new Set();
//         for (const v of vulnerabilities) {
//             let rec = exactMap[v];

//             //  ▷ dynamic “Sensitive Information Exposure: …”
//             if (!rec && v.startsWith('Sensitive Information Exposure:')) {
//                 rec = sensitiveRec;
//             }

//             //  ▷ dynamic “<header> header missing”
//             if (!rec && v.endsWith(' header missing')) {
//                 const headerName = v.split(' ')[0].toLowerCase();
//                 rec = headerRecMap[headerName] ||
//                     'Add the missing security header to follow best practices.';
//             }

//             //  ▷ if we found a recommendation, and it’s new, list it
//             if (rec && !seen.has(rec)) {
//                 seen.add(rec);
//                 doc.fontSize(12).list([rec]).moveDown(0.5);
//             }
//         }
//     }

//     try {
//         const doc = new PDFDocument({ margin: 50, size: 'A4' });
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//             'Content-Disposition',
//             `attachment; filename="scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf"`
//         );
//         doc.pipe(res);

//         // Title & metadata
//         doc.fontSize(20).text('Web App Vulnerability Scan Report', { align: 'center' }).moveDown();
//         doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
//         doc.text(`Target URL: ${url}`).moveDown();

//         // Vulnerabilities
//         doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
//         if (vulnerabilities.length === 0) {
//             doc.fontSize(12).text('No vulnerabilities were detected.');
//         } else {
//             vulnerabilities.forEach((v, i) => {
//                 doc.fontSize(12).text(`${i + 1}. ${v}`).moveDown(0.2);
//             });
//         }
//         doc.moveDown();

//         // Relevant mitigations
//         if (vulnerabilities.length) {
//             doc.fontSize(16).text('Mitigation Recommendations:', { underline: true });
//             const seen = new Set();
//             vulnerabilities.forEach(v => {
//                 const rec = mitigationMap[v];
//                 if (rec && !seen.has(rec)) {
//                     seen.add(rec);
//                     doc.fontSize(12).list([rec]).moveDown(0.5);
//                 }
//             });
//         }

//         // Footer & finalize
//         doc.moveDown();
//         doc.fontSize(10).text('Generated by Web App Vulnerability Scanner', { align: 'center' });
//         doc.end();

//     } catch (err) {
//         console.error('Error generating PDF:', err);
//         if (!res.headersSent) res.status(500).json({ error: 'Failed to generate PDF' });
//         else res.end();
//     }
// });

// /** ── START SERVER ───────────────────────────────────────────────────── */
// const PORT = process.env.PORT || 1121;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js

const express       = require('express');
const cors          = require('cors');
const axios         = require('axios');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const helmet        = require('helmet');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit');
const { URL }       = require('url');
const dns           = require('dns').promises;
const Joi           = require('joi');
const ScanResult    = require('./models/scanResult.js');
const PDFDocument   = require('pdfkit');
require('dotenv').config();

const app = express();

/** ── GLOBAL MIDDLEWARE ───────────────────────────────────────────── */
// CORS — restrict origins as needed
app.use(cors({  }));
// Body parser with size limit
app.use(bodyParser.json({ limit: '100kb' }));
// Security headers
app.use(helmet());
// HTTP request logging
app.use(morgan('combined'));
// Rate limiting
app.use(rateLimit({
    windowMs:   Number(process.env.RATE_LIMIT_WINDOW_MS),  
    max:        Number(process.env.RATE_LIMIT_MAX),        
    message:    'Too many requests, please try again later.'
  }));  

/** ── DATABASE CONNECTION ─────────────────────────────────────────── */
// mongoose.connect(
//   'mongodb+srv://eyyunnisaisrinivasapradeep:b6Y80dGtfR12UPcA@cluster1.xz9wb.mongodb.net/?retryWrites=true&w=majority',
//   { appName: 'Cluster1' }
// )
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));
mongoose.connect(
    process.env.MONGODB_URI,
  
  )
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
  
/** ── SSRF PROTECTION & URL VALIDATION ─────────────────────────────── */
const validateUrl = async (req, res, next) => {
  const schema = Joi.object({
    url: Joi.string().uri({ scheme: [/https?/] }).required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: 'Invalid URL format' });

  try {
    const hostname = new URL(value.url).hostname;
    const addrs = await dns.lookup(hostname, { all: true });
    for (let { address } of addrs) {
      if (
        address.startsWith('10.') ||
        address.startsWith('192.168.') ||
        address.startsWith('127.') ||
        address.startsWith('172.16.')
      ) {
        return res.status(400).json({ error: 'URL resolves to a private or loopback address' });
      }
    }
  } catch {
    return res.status(400).json({ error: 'Unable to resolve hostname' });
  }

  req.safeUrl = value.url;
  next();
};

/** ── RESTRICTED AXIOS INSTANCE ───────────────────────────────────── */
const http = axios.create({
  timeout: 5000,
  maxRedirects: 0,
  maxContentLength: 1_000_000
});

/** ── SECURITY SCANNER ROUTE ───────────────────────────────────────── */
app.post('/api/scan', validateUrl, async (req, res) => {
  const url = req.safeUrl;
  const vulnerabilities = [];

  // Payloads & checks
  const sqlPayloads          = ["' OR '1'='1", "' OR 'a'='a"];
  const xssPayloads          = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
  const dirTraversalPayloads = ['../etc/passwd', '../../etc/shadow'];
  const openRedirectPayload  = '/redirect?url=https://evil.com';
  const sensitiveKeywords    = ['api_key', 'password', 'secret', 'token'];
  const requiredHeaders      = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy'
  ];
  const isHttps = u => u.startsWith('https');

  // Helper to safely fetch
  const fetchData = async target => {
    try {
      const resp = await http.get(target);
      return { data: resp.data, headers: resp.headers, finalUrl: resp.request?.res?.responseUrl };
    } catch {
      return { data: '', headers: {}, finalUrl: null };
    }
  };

  // SQL Injection
  for (let p of sqlPayloads) {
    const { data } = await fetchData(`${url}?id=${encodeURIComponent(p)}`);
    if (/SQL syntax|SQL error/i.test(data)) {
      vulnerabilities.push('SQL Injection vulnerability detected');
      break;
    }
  }

  // XSS
  for (let p of xssPayloads) {
    const { data } = await fetchData(`${url}?q=${encodeURIComponent(p)}`);
    if (data.includes(p)) {
      vulnerabilities.push('XSS vulnerability detected');
      break;
    }
  }

  // Open Redirect
  {
    const { finalUrl } = await fetchData(`${url}${openRedirectPayload}`);
    if (finalUrl?.includes('evil.com')) {
      vulnerabilities.push('Open Redirect vulnerability detected');
    }
  }

  // Directory Traversal
  for (let p of dirTraversalPayloads) {
    const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
    if (data.includes('root:') || data.includes('shadow:')) {
      vulnerabilities.push('Directory Traversal vulnerability detected');
      break;
    }
  }

  // Sensitive Info & Header checks
  {
    const { data, headers } = await fetchData(url);
    const lc = data.toLowerCase();
    sensitiveKeywords.forEach(k => {
      if (lc.includes(k)) {
        vulnerabilities.push(`Sensitive Information Exposure: ${k} found`);
      }
    });
    requiredHeaders.forEach(h => {
      if (!headers[h]) {
        vulnerabilities.push(`${h} header missing`);
      }
    });
  }

  // SSL/TLS check
  if (!isHttps(url)) {
    vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');
  }

  // Persist result
  await new ScanResult({ url, vulnerabilities, date: new Date() }).save();
  res.json({ message: 'Scan completed', vulnerabilities });
});

/** ── HISTORY ROUTE ───────────────────────────────────────────────── */
app.get('/api/history', async (req, res) => {
  try {
    const history = await ScanResult.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ── PDF GENERATION ROUTE ─────────────────────────────────────────── */
app.post('/api/generate-pdf', async (req, res) => {
  const { url, vulnerabilities, date } = req.body;
  if (!url || !vulnerabilities || !date) {
    return res.status(400).json({ error: 'Missing required data for PDF generation' });
  }

  // Exact mappings
  const exactMap = {
    'SQL Injection vulnerability detected':
      'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.',
    'XSS vulnerability detected':
      'Escape or sanitize all user inputs before rendering. Implement a strong Content Security Policy (CSP).',
    'Open Redirect vulnerability detected':
      'Validate all redirect URLs against a whitelist of trusted domains.',
    'Directory Traversal vulnerability detected':
      'Sanitize file paths and enforce strict access controls on directories.',
    'SSL/TLS Configuration Issue: HTTPS not used':
      'Enable HTTPS everywhere; redirect all HTTP traffic to HTTPS with strong ciphers.',
  };

  // Generic mappings
  const sensitiveRec = 'Remove sensitive data from responses; use environment variables and secrets management.';
  const headerRecMap = {
    'content-security-policy':
      'Add a strict Content-Security-Policy header to mitigate XSS and resource injection.',
    'strict-transport-security':
      'Implement HSTS to force browsers to use HTTPS.',
    'x-content-type-options':
      'Add X-Content-Type-Options: nosniff to prevent MIME sniffing.',
    'x-frame-options':
      'Add X-Frame-Options to prevent clickjacking.',
    'referrer-policy':
      'Add a Referrer-Policy header to control referrer leakage.'
  };

  // Begin PDF
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf"`
  );
  doc.pipe(res);

  // Title & metadata
  doc.fontSize(20).text('Web App Vulnerability Scan Report', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
  doc.text(`Target URL: ${url}`).moveDown();

  // Detected vulnerabilities
  doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
  if (vulnerabilities.length === 0) {
    doc.fontSize(12).text('No vulnerabilities were detected.');
  } else {
    vulnerabilities.forEach((v, i) => {
      doc.fontSize(12).text(`${i + 1}. ${v}`).moveDown(0.2);
    });
  }
  doc.moveDown();

  // Mitigation recommendations
  if (vulnerabilities.length) {
    doc.fontSize(16).text('Mitigation Recommendations:', { underline: true });
    const seen = new Set();

    for (const v of vulnerabilities) {
      let rec = exactMap[v];

      if (!rec && v.startsWith('Sensitive Information Exposure:')) {
        rec = sensitiveRec;
      }
      if (!rec && v.endsWith(' header missing')) {
        const headerName = v.split(' ')[0].toLowerCase();
        rec = headerRecMap[headerName] || 'Add the missing security header.';
      }

      if (rec && !seen.has(rec)) {
        seen.add(rec);
        doc.fontSize(12).list([rec]).moveDown(0.5);
      }
    }
  }

  // Footer & finalize
  doc.moveDown();
  doc.fontSize(10).text('Generated by Web App Vulnerability Scanner', { align: 'center' });
  doc.end();
});

/** ── START SERVER ─────────────────────────────────────────────────── */
const PORT = process.env.PORT || 1121;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
