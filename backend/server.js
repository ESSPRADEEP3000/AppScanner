// // // server.js

// // const express       = require('express');
// // const cors          = require('cors');
// // const axios         = require('axios');
// // const mongoose      = require('mongoose');
// // const bodyParser    = require('body-parser');
// // const helmet        = require('helmet');
// // const morgan        = require('morgan');
// // const rateLimit     = require('express-rate-limit');
// // const { URL }       = require('url');
// // const dns           = require('dns').promises;
// // const Joi           = require('joi');
// // const ScanResult    = require('./models/scanResult.js');
// // const PDFDocument   = require('pdfkit');
// // require('dotenv').config();

// // const app = express();

// // /** ── GLOBAL MIDDLEWARE ───────────────────────────────────────────── */
// // // CORS — restrict origins as needed
// // app.use(cors({  }));
// // // Body parser with size limit
// // app.use(bodyParser.json({ limit: '100000kb' }));
// // // Security headers
// // app.use(helmet());
// // // HTTP request logging
// // app.use(morgan('combined'));
// // // Rate limiting
// // app.use(rateLimit({
// //     windowMs:   Number(process.env.RATE_LIMIT_WINDOW_MS),  
// //     max:        Number(process.env.RATE_LIMIT_MAX),        
// //     message:    'Too many requests, please try again later.'
// //   }));  

// // /** ── DATABASE CONNECTION ─────────────────────────────────────────── */
// // // mongoose.connect(
// // //   'mongodb+srv://eyyunnisaisrinivasapradeep:b6Y80dGtfR12UPcA@cluster1.xz9wb.mongodb.net/?retryWrites=true&w=majority',
// // //   { appName: 'Cluster1' }
// // // )
// // //   .then(() => console.log('Connected to MongoDB'))
// // //   .catch(err => console.error('MongoDB connection error:', err));
// // mongoose.connect(
// //     process.env.MONGODB_URI,
  
// //   )
// //     .then(() => console.log('Connected to MongoDB'))
// //     .catch(err => console.error('MongoDB connection error:', err));
  
// // /** ── SSRF PROTECTION & URL VALIDATION ─────────────────────────────── */
// // const validateUrl = async (req, res, next) => {
// //   const schema = Joi.object({
// //     url: Joi.string().uri({ scheme: [/https?/] }).required()
// //   });
// //   const { error, value } = schema.validate(req.body);
// //   if (error) return res.status(400).json({ error: 'Invalid URL format' });

// //   try {
// //     const hostname = new URL(value.url).hostname;
// //     const addrs = await dns.lookup(hostname, { all: true });
// //     for (let { address } of addrs) {
// //       if (
// //         address.startsWith('10.') ||
// //         address.startsWith('192.168.') ||
// //         address.startsWith('127.') ||
// //         address.startsWith('172.16.')
// //       ) {
// //         return res.status(400).json({ error: 'URL resolves to a private or loopback address' });
// //       }
// //     }
// //   } catch {
// //     return res.status(400).json({ error: 'Unable to resolve hostname' });
// //   }

// //   req.safeUrl = value.url;
// //   next();
// // };

// // /** ── RESTRICTED AXIOS INSTANCE ───────────────────────────────────── */
// // const http = axios.create({
// //   timeout: 5000,
// //   maxRedirects: 0,
// //   maxContentLength: 1_000_000
// // });

// // /** ── SECURITY SCANNER ROUTE ───────────────────────────────────────── */
// // app.post('/api/scan', validateUrl, async (req, res) => {
// //   const url = req.safeUrl;
// //   const vulnerabilities = [];

// //   // Payloads & checks
// //   const sqlPayloads          = ["' OR '1'='1", "' OR 'a'='a"];
// //   const xssPayloads          = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
// //   const dirTraversalPayloads = ['../etc/passwd', '../../etc/shadow'];
// //   const openRedirectPayload  = '/redirect?url=https://evil.com';
// //   const sensitiveKeywords    = ['api_key', 'password', 'secret', 'token'];
// //   const requiredHeaders      = [
// //     'content-security-policy',
// //     'strict-transport-security',
// //     'x-content-type-options',
// //     'x-frame-options',
// //     'referrer-policy'
// //   ];
// //   const isHttps = u => u.startsWith('https');

// //   // Helper to safely fetch
// //   const fetchData = async target => {
// //     try {
// //       const resp = await http.get(target);
// //       return { data: resp.data, headers: resp.headers, finalUrl: resp.request?.res?.responseUrl };
// //     } catch {
// //       return { data: '', headers: {}, finalUrl: null };
// //     }
// //   };

// //   // SQL Injection
// //   for (let p of sqlPayloads) {
// //     const { data } = await fetchData(`${url}?id=${encodeURIComponent(p)}`);
// //     if (/SQL syntax|SQL error/i.test(data)) {
// //       vulnerabilities.push('SQL Injection vulnerability detected');
// //       break;
// //     }
// //   }

// //   // XSS
// //   for (let p of xssPayloads) {
// //     const { data } = await fetchData(`${url}?q=${encodeURIComponent(p)}`);
// //     if (data.includes(p)) {
// //       vulnerabilities.push('XSS vulnerability detected');
// //       break;
// //     }
// //   }

// //   // Open Redirect
// //   {
// //     const { finalUrl } = await fetchData(`${url}${openRedirectPayload}`);
// //     if (finalUrl?.includes('evil.com')) {
// //       vulnerabilities.push('Open Redirect vulnerability detected');
// //     }
// //   }

// //   // Directory Traversal
// //   for (let p of dirTraversalPayloads) {
// //     const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
// //     if (data.includes('root:') || data.includes('shadow:')) {
// //       vulnerabilities.push('Directory Traversal vulnerability detected');
// //       break;
// //     }
// //   }

// //   // Sensitive Info & Header checks
// //   {
// //     const { data, headers } = await fetchData(url);
// //     const lc = data.toLowerCase();
// //     sensitiveKeywords.forEach(k => {
// //       if (lc.includes(k)) {
// //         vulnerabilities.push(`Sensitive Information Exposure: ${k} found`);
// //       }
// //     });
// //     requiredHeaders.forEach(h => {
// //       if (!headers[h]) {
// //         vulnerabilities.push(`${h} header missing`);
// //       }
// //     });
// //   }

// //   // SSL/TLS check
// //   if (!isHttps(url)) {
// //     vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');
// //   }

// //   // Persist result
// //   await new ScanResult({ url, vulnerabilities, date: new Date() }).save();
// //   res.json({ message: 'Scan completed', vulnerabilities });
// // });

// // /** ── HISTORY ROUTE ───────────────────────────────────────────────── */
// // app.get('/api/history', async (req, res) => {
// //   try {
// //     const history = await ScanResult.find().sort({ date: -1 });
// //     res.json(history);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // /** ── PDF GENERATION ROUTE ─────────────────────────────────────────── */
// // app.post('/api/generate-pdf', async (req, res) => {
// //   const { url, vulnerabilities, date } = req.body;
// //   if (!url || !vulnerabilities || !date) {
// //     return res.status(400).json({ error: 'Missing required data for PDF generation' });
// //   }

// //   // Exact mappings
// //   const exactMap = {
// //     'SQL Injection vulnerability detected':
// //       'Use parameterized queries or prepared statements. Validate and sanitize all user inputs.',
// //     'XSS vulnerability detected':
// //       'Escape or sanitize all user inputs before rendering. Implement a strong Content Security Policy (CSP).',
// //     'Open Redirect vulnerability detected':
// //       'Validate all redirect URLs against a whitelist of trusted domains.',
// //     'Directory Traversal vulnerability detected':
// //       'Sanitize file paths and enforce strict access controls on directories.',
// //     'SSL/TLS Configuration Issue: HTTPS not used':
// //       'Enable HTTPS everywhere; redirect all HTTP traffic to HTTPS with strong ciphers.',
// //   };

// //   // Generic mappings
// //   const sensitiveRec = 'Remove sensitive data from responses; use environment variables and secrets management.';
// //   const headerRecMap = {
// //     'content-security-policy':
// //       'Add a strict Content-Security-Policy header to mitigate XSS and resource injection.',
// //     'strict-transport-security':
// //       'Implement HSTS to force browsers to use HTTPS.',
// //     'x-content-type-options':
// //       'Add X-Content-Type-Options: nosniff to prevent MIME sniffing.',
// //     'x-frame-options':
// //       'Add X-Frame-Options to prevent clickjacking.',
// //     'referrer-policy':
// //       'Add a Referrer-Policy header to control referrer leakage.'
// //   };

// //   // Begin PDF
// //   const doc = new PDFDocument({ margin: 50, size: 'A4' });
// //   res.setHeader('Content-Type', 'application/pdf');
// //   res.setHeader(
// //     'Content-Disposition',
// //     `attachment; filename="scan-report-${url.replace(/[^a-z0-9]/gi, '_')}.pdf"`
// //   );
// //   doc.pipe(res);

// //   // Title & metadata
// //   doc.fontSize(20).text('Web App Vulnerability Scan Report', { align: 'center' }).moveDown();
// //   doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
// //   doc.text(`Target URL: ${url}`).moveDown();

// //   // Detected vulnerabilities
// //   doc.fontSize(16).text('Detected Vulnerabilities:', { underline: true });
// //   if (vulnerabilities.length === 0) {
// //     doc.fontSize(12).text('No vulnerabilities were detected.');
// //   } else {
// //     vulnerabilities.forEach((v, i) => {
// //       doc.fontSize(12).text(`${i + 1}. ${v}`).moveDown(0.2);
// //     });
// //   }
// //   doc.moveDown();

// //   // Mitigation recommendations
// //   if (vulnerabilities.length) {
// //     doc.fontSize(16).text('Mitigation Recommendations:', { underline: true });
// //     const seen = new Set();

// //     for (const v of vulnerabilities) {
// //       let rec = exactMap[v];

// //       if (!rec && v.startsWith('Sensitive Information Exposure:')) {
// //         rec = sensitiveRec;
// //       }
// //       if (!rec && v.endsWith(' header missing')) {
// //         const headerName = v.split(' ')[0].toLowerCase();
// //         rec = headerRecMap[headerName] || 'Add the missing security header.';
// //       }

// //       if (rec && !seen.has(rec)) {
// //         seen.add(rec);
// //         doc.fontSize(12).list([rec]).moveDown(0.5);
// //       }
// //     }
// //   }

// //   // Footer & finalize
// //   doc.moveDown();
// //   doc.fontSize(10).text('Generated by Web App Vulnerability Scanner', { align: 'center' });
// //   doc.end();
// // });

// // /** ── START SERVER ─────────────────────────────────────────────────── */
// // const PORT = process.env.PORT || 1121;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// // server.js
// // require('dotenv').config();
// // const express       = require('express');
// // const cors          = require('cors');
// // const axios         = require('axios');
// // const mongoose      = require('mongoose');
// // const bodyParser    = require('body-parser');
// // const helmet        = require('helmet');
// // const morgan        = require('morgan');
// // const rateLimit     = require('express-rate-limit');
// // const { URL }       = require('url');
// // const dns           = require('dns').promises;
// // const Joi           = require('joi');
// // const cheerio       = require('cheerio');
// // const ScanResult    = require('./models/scanResult.js');
// // const PDFDocument   = require('pdfkit');

// // const app = express();

// // ////////////////////////////////////////////////////////////////////////////////
// // // GLOBAL MIDDLEWARE
// // ////////////////////////////////////////////////////////////////////////////////
// // app.use(cors({ /* configure allowed origins here */ }));
// // app.use(bodyParser.json({ limit: '100mb' }));
// // app.use(helmet());
// // app.use(morgan('combined'));
// // app.use(rateLimit({
// //   windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
// //   max:      Number(process.env.RATE_LIMIT_MAX)       || 100,
// //   message:  'Too many requests, please try again later.'
// // }));

// // ////////////////////////////////////////////////////////////////////////////////
// // // DATABASE CONNECTION
// // ////////////////////////////////////////////////////////////////////////////////
// // mongoose.connect(process.env.MONGODB_URI)
// //   .then(() => console.log('✔ Connected to MongoDB'))
// //   .catch(err => console.error('✘ MongoDB connection error:', err));

// // ////////////////////////////////////////////////////////////////////////////////
// // // SSRF PROTECTION & URL VALIDATION
// // ////////////////////////////////////////////////////////////////////////////////
// // const privateRanges = [
// //   /^10\./, /^127\./, /^192\.168\./,
// //   /^172\.(1[6-9]|2\d|3[0-1])\./,
// //   /^fc00:/, /^fe80:/
// // ];
// // async function validateUrl(req, res, next) {
// //   const schema = Joi.object({
// //     url: Joi.string().uri({ scheme: ['http','https'] }).required()
// //   });
// //   const { error, value } = schema.validate(req.body);
// //   if (error) return res.status(400).json({ error: 'Invalid URL' });

// //   try {
// //     const { hostname, port } = new URL(value.url);
// //     if (port && !['80','443'].includes(port)) {
// //       return res.status(400).json({ error: 'Custom ports not allowed' });
// //     }
// //     const addrs = await dns.lookup(hostname, { all: true });
// //     for (let { address } of addrs) {
// //       if (privateRanges.some(rx => rx.test(address))) {
// //         return res.status(400).json({ error: 'URL resolves to private network' });
// //       }
// //     }
// //   } catch {
// //     return res.status(400).json({ error: 'Cannot resolve hostname' });
// //   }
// //   req.safeUrl = value.url;
// //   next();
// // }

// // ////////////////////////////////////////////////////////////////////////////////
// // // RESTRICTED AXIOS INSTANCE
// // ////////////////////////////////////////////////////////////////////////////////
// // const http = axios.create({
// //   timeout:          5000,
// //   maxRedirects:     0,
// //   maxContentLength: 1_000_000
// // });

// // ////////////////////////////////////////////////////////////////////////////////
// // // PAYLOAD LIBRARIES
// // ////////////////////////////////////////////////////////////////////////////////
// // const sqlTests = [
// //   { payload: "' OR '1'='1",                 detect: /SQL syntax|SQL error/i },
// //   { payload: "' UNION SELECT NULL,version()--", detect: /PostgreSQL|MySQL|SQLite/i },
// //   { payload: "' AND SLEEP(5)--",            type: 'blind-time' },
// //   { payload: "' UNION SELECT table_name,NULL FROM information_schema.tables--", detect: /table_name/i }
// // ];

// // const xssTests = [
// //   { payload: '<script>fetch("/")</script>', detect: /<script>/i },
// //   { payload: '" onmouseover=alert(1) x="',  detectAttr: 'onmouseover' },
// //   { payload: '<svg><script>alert(1)</script></svg>', detect: /<svg>/i },
// //   { payload: `"}];alert(1);//`,               detect: /alert\(1\)/i }
// // ];

// // const redirectPayloads = [
// //   '/redirect?url=https://evil.com',
// //   '/redirect?url=//evil.com',
// //   '/redirect?url=%2F%2Fevil.com'
// // ];

// // const headerChecks = {
// //   'content-security-policy':   /default-src 'self'/,
// //   'strict-transport-security':  /max-age=\d+/,
// //   'x-content-type-options':     /nosniff/,
// //   'x-frame-options':            /DENY|SAMEORIGIN/,
// //   'referrer-policy':            /no-referrer/
// // };

// // const dtPayloads = ['../etc/passwd','../../etc/shadow','../../../etc/hosts'];
// // const sensitiveKeywords = ['api_key','secret','token','password'];

// // ////////////////////////////////////////////////////////////////////////////////
// // // HELPER: FETCH DATA
// // ////////////////////////////////////////////////////////////////////////////////
// // async function fetchData(target) {
// //   try {
// //     const resp = await http.get(target);
// //     return {
// //       data:      resp.data,
// //       headers:   resp.headers,
// //       finalUrl:  resp.request?.res?.responseUrl
// //     };
// //   } catch {
// //     return { data: '', headers: {}, finalUrl: null };
// //   }
// // }

// // ////////////////////////////////////////////////////////////////////////////////
// // // TEST FUNCTIONS
// // ////////////////////////////////////////////////////////////////////////////////
// // async function testSql(url, results) {
// //   for (let t of sqlTests) {
// //     const start = Date.now();
// //     const { data } = await fetchData(`${url}?id=${encodeURIComponent(t.payload)}`);
// //     const duration = Date.now() - start;

// //     if (t.type === 'blind-time' && duration > 4000) {
// //       results.push('Blind SQL Injection (time-based) detected');
// //       return;
// //     }
// //     if (t.detect && t.detect.test(data)) {
// //       results.push(`SQL Injection via payload: ${t.payload}`);
// //       return;
// //     }
// //   }
// // }

// // async function testXss(url, results) {
// //   for (let t of xssTests) {
// //     const { data } = await fetchData(`${url}?q=${encodeURIComponent(t.payload)}`);
// //     const $ = cheerio.load(data);
// //     let found = false;

// //     if (t.detect && t.detect.test(data)) found = true;
// //     if (t.detectAttr && $(`[${t.detectAttr}]`).length) found = true;

// //     if (found) {
// //       results.push(`XSS via payload: ${t.payload}`);
// //       return;
// //     }
// //   }
// // }

// // async function testRedirect(url, results) {
// //   for (let p of redirectPayloads) {
// //     const { finalUrl } = await fetchData(url + p);
// //     if (finalUrl && finalUrl.includes('evil.com')) {
// //       results.push(`Open Redirect via payload: ${p}`);
// //       return;
// //     }
// //   }
// // }

// // async function testHeaders(url, results) {
// //   const { headers } = await fetchData(url);
// //   for (let [hdr, pattern] of Object.entries(headerChecks)) {
// //     if (!headers[hdr] || !pattern.test(headers[hdr])) {
// //       results.push(`${hdr} header missing or too lax`);
// //     }
// //   }
// // }

// // async function testDirTraversal(url, results) {
// //   for (let p of dtPayloads) {
// //     const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
// //     if (/root:|shadow:|127\.0\.0\.1/.test(data)) {
// //       results.push(`Directory Traversal via payload: ${p}`);
// //       return;
// //     }
// //   }
// // }

// // async function testSensitive(url, results) {
// //   const { data } = await fetchData(url);
// //   const low = data.toLowerCase();
// //   for (let k of sensitiveKeywords) {
// //     if (low.includes(k)) {
// //       results.push(`Sensitive data exposure: '${k}' found`);
// //     }
// //   }
// // }

// // ////////////////////////////////////////////////////////////////////////////////
// // // SCAN ROUTE
// // ////////////////////////////////////////////////////////////////////////////////
// // app.post('/api/scan', validateUrl, async (req, res) => {
// //   const url = req.safeUrl;
// //   const vulnerabilities = [];

// //   // dynamically import p-limit for concurrency control
// //   const { default: pLimit } = await import('p-limit');
// //   const limit = pLimit(5);

// //   await Promise.all([
// //     limit(() => testSql(url, vulnerabilities)),
// //     limit(() => testXss(url, vulnerabilities)),
// //     limit(() => testRedirect(url, vulnerabilities)),
// //     limit(() => testHeaders(url, vulnerabilities)),
// //     limit(() => testDirTraversal(url, vulnerabilities)),
// //     limit(() => testSensitive(url, vulnerabilities))
// //   ]);

// //   // SSL/TLS check
// //   if (!url.startsWith('https://')) {
// //     vulnerabilities.push('SSL/TLS issue: HTTPS not used');
// //   }

// //   // Persist and respond
// //   await new ScanResult({ url, vulnerabilities, date: new Date() }).save();
// //   res.json({ message: 'Scan completed', vulnerabilities });
// // });

// // ////////////////////////////////////////////////////////////////////////////////
// // // HISTORY ROUTE
// // ////////////////////////////////////////////////////////////////////////////////
// // app.get('/api/history', async (req, res) => {
// //   try {
// //     const history = await ScanResult.find().sort({ date: -1 });
// //     res.json(history);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // ////////////////////////////////////////////////////////////////////////////////
// // // PDF REPORT ROUTE
// // ////////////////////////////////////////////////////////////////////////////////
// // app.post('/api/generate-pdf', async (req, res) => {
// //   const { url, vulnerabilities, date } = req.body;
// //   if (!url || !Array.isArray(vulnerabilities) || !date) {
// //     return res.status(400).json({ error: 'Missing data for PDF' });
// //   }

// //   const exactMap = {
// //     'SSL/TLS issue: HTTPS not used':
// //       'Enable HTTPS and redirect HTTP to HTTPS with strong ciphers.',
// //   };
// //   const headerMap = {
// //     'content-security-policy':
// //       'Add a strict Content-Security-Policy header.',
// //     'strict-transport-security':
// //       'Implement HSTS with a long max-age.',
// //     'x-content-type-options':
// //       'Add X-Content-Type-Options: nosniff.',
// //     'x-frame-options':
// //       'Add X-Frame-Options to prevent clickjacking.',
// //     'referrer-policy':
// //       'Add Referrer-Policy: no-referrer.'
// //   };

// //   const doc = new PDFDocument({ margin:50, size:'A4' });
// //   res.setHeader('Content-Type','application/pdf');
// //   res.setHeader('Content-Disposition',`attachment; filename="report-${Date.now()}.pdf"`);
// //   doc.pipe(res);

// //   doc.fontSize(20).text('Vulnerability Scan Report', { align:'center' }).moveDown();
// //   doc.fontSize(12).text(`Date: ${new Date(date).toLocaleString()}`);
// //   doc.text(`Target: ${url}`).moveDown();

// //   doc.fontSize(16).text('Findings:',{underline:true});
// //   vulnerabilities.length
// //     ? vulnerabilities.forEach((v,i) => doc.text(`${i+1}. ${v}`))
// //     : doc.text('No vulnerabilities found.');
// //   doc.moveDown();

// //   if (vulnerabilities.length) {
// //     doc.fontSize(16).text('Recommendations:',{underline:true});
// //     const seen = new Set();
// //     vulnerabilities.forEach(v => {
// //       let rec = exactMap[v] || headerMap[v.split(' ')[0].toLowerCase()] ||
// //                 (v.includes('XSS') ? 'Sanitize all user inputs and enforce CSP.' :
// //                 v.includes('SQL') ? 'Use parameterized queries and ORM.' :
// //                 'Review and fix this issue.');
// //       if (!seen.has(rec)) {
// //         seen.add(rec);
// //         doc.list([rec]).moveDown(0.5);
// //       }
// //     });
// //   }

// //   doc.fontSize(10).text('Generated by Web App Vulnerability Scanner',{align:'center'});
// //   doc.end();
// // });

// // ////////////////////////////////////////////////////////////////////////////////
// // // START SERVER
// // ////////////////////////////////////////////////////////////////////////////////
// // const PORT = process.env.PORT || 1121;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// // server.js
// // require('dotenv').config();
// // const express     = require('express');
// // const cors        = require('cors');
// // const axios       = require('axios');
// // const mongoose    = require('mongoose');
// // const bodyParser  = require('body-parser');
// // const helmet      = require('helmet');
// // const morgan      = require('morgan');
// // const rateLimit   = require('express-rate-limit');
// // const { URL }     = require('url');
// // const dns         = require('dns').promises;
// // const Joi         = require('joi');
// // const cheerio     = require('cheerio');
// // const ScanResult  = require('./models/scanResult.js');
// // const PDFDocument = require('pdfkit');

// // const app = express();

// // // ── GLOBAL MIDDLEWARE ─────────────────────────────────────────────────────
// // app.use(cors());
// // app.use(bodyParser.json({ limit: '100mb' }));
// // app.use(helmet());
// // app.use(morgan('combined'));
// // app.use(rateLimit({
// //   windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
// //   max:      Number(process.env.RATE_LIMIT_MAX)       || 100,
// //   message:  'Too many requests'
// // }));

// // // ── DATABASE ───────────────────────────────────────────────────────────────
// // mongoose.connect(process.env.MONGODB_URI)
// //   .then(() => console.log('✔ MongoDB connected'))
// //   .catch(e => console.error('✘ MongoDB error', e));

// // // ── URL VALIDATION ─────────────────────────────────────────────────────────
// // const privateRanges = [
// //   /^10\./, /^127\./, /^192\.168\./,
// //   /^172\.(1[6-9]|2\d|3[0-1])\./,
// //   /^fc00:/, /^fe80:/
// // ];
// // async function validateUrl(req, res, next) {
// //   const schema = Joi.object({ url: Joi.string().uri({ scheme: ['http','https'] }).required() });
// //   const { error, value } = schema.validate(req.body);
// //   if (error) return res.status(400).json({ error: 'Invalid URL' });

// //   try {
// //     const { hostname, port } = new URL(value.url);
// //     if (port && !['80','443'].includes(port))
// //       return res.status(400).json({ error: 'Custom ports not allowed' });

// //     const addrs = await dns.lookup(hostname, { all: true });
// //     for (let { address } of addrs)
// //       if (privateRanges.some(rx => rx.test(address)))
// //         return res.status(400).json({ error: 'URL resolves to private network' });

// //   } catch {
// //     return res.status(400).json({ error: 'Cannot resolve hostname' });
// //   }

// //   req.safeUrl = value.url;
// //   next();
// // }

// // // ── AXIOS INSTANCE ────────────────────────────────────────────────────────
// // const http = axios.create({ timeout: 5000, maxRedirects: 0, maxContentLength: 1_000_000 });

// // // ── PAYLOAD LIBRARIES ─────────────────────────────────────────────────────
// // const sqlTests = [
// //   { name: 'Error-based SQLi',       payload: "' OR '1'='1",                  detect: /SQL syntax|SQL error/i },
// //   { name: 'Union-based SQLi',       payload: "' UNION SELECT NULL,version()--", detect: /PostgreSQL|MySQL|SQLite/i },
// //   { name: 'Time-based Blind SQLi',  payload: "' AND SLEEP(5)--",             type: 'blind-time', threshold: 4000 },
// //   { name: 'Schema Enumeration',     payload: "' UNION SELECT table_name,NULL FROM information_schema.tables--", detect: /table_name/i }
// // ];
// // const xssTests = [
// //   { name: 'Script-injection XSS', payload: '<script>alert(1)</script>',          detect: /<script>/i },
// //   { name: 'Event-handler XSS',    payload: '" onmouseover=alert(1) x="',         detectAttr: 'onmouseover' },
// //   { name: 'SVG XSS',              payload: '<svg><script>alert(1)</script></svg>', detect: /<svg>/i },
// //   { name: 'JS-context XSS',       payload: `"}];alert(1);//`,                     detect: /alert\(1\)/i }
// // ];
// // const redirectTests = [
// //   { name: 'Open Redirect', payload: '/redirect?url=https://evil.com' },
// //   { name: 'Encoded Redirect', payload: '/redirect?url=%2F%2Fevil.com' }
// // ];
// // const headerTests = {
// //   'Content-Security-Policy':   /default-src 'self'/,
// //   'Strict-Transport-Security': /max-age=\d+/,
// //   'X-Content-Type-Options':    /nosniff/,
// //   'X-Frame-Options':           /DENY|SAMEORIGIN/,
// //   'Referrer-Policy':           /no-referrer/
// // };
// // const dtTests = [
// //   { name: 'passwd Traversal', payload: '../etc/passwd',   detect: /root:/ },
// //   { name: 'shadow Traversal', payload: '../../etc/shadow', detect: /shadow:/ }
// // ];
// // const sensitiveKeywords = ['api_key','secret','token','password'];

// // // ── HELPERS ────────────────────────────────────────────────────────────────
// // async function fetchData(u) {
// //   try { const r = await http.get(u); return { data: r.data, headers: r.headers, finalUrl: r.request.res.responseUrl }; }
// //   catch { return { data: '', headers: {}, finalUrl: null }; }
// // }

// // // run and record a single test
// // async function runTest({ name, fn }) {
// //   const result = { name, applied: true, success: false, details: '' };
// //   try {
// //     await fn(result);
// //   } catch (e) {
// //     result.success = false;
// //     result.details = `Error: ${e.message}`;
// //   }
// //   return result;
// // }

// // // ── SCAN ROUTE ────────────────────────────────────────────────────────────
// // app.post('/api/scan', validateUrl, async (req, res) => {
// //   const url = req.safeUrl;
// //   const testResults = [];

// //   // SQLi
// //   for (let t of sqlTests) {
// //     testResults.push(await runTest({
// //       name: t.name,
// //       fn: async (r) => {
// //         const start = Date.now();
// //         const { data } = await fetchData(`${url}?id=${encodeURIComponent(t.payload)}`);
// //         const dur = Date.now() - start;
// //         if (t.type === 'blind-time') {
// //           if (dur > t.threshold) { r.success = true; r.details = `delay ${dur}ms`; }
// //         } else if (t.detect && t.detect.test(data)) {
// //           r.success = true; r.details = `payload=${t.payload}`;
// //         }
// //       }
// //     }));
// //   }

// //   // XSS
// //   for (let t of xssTests) {
// //     testResults.push(await runTest({
// //       name: t.name,
// //       fn: async (r) => {
// //         const { data } = await fetchData(`${url}?q=${encodeURIComponent(t.payload)}`);
// //         const $ = cheerio.load(data);
// //         if ((t.detect && t.detect.test(data)) || (t.detectAttr && $(`[${t.detectAttr}]`).length)) {
// //           r.success = true; r.details = `payload=${t.payload}`;
// //         }
// //       }
// //     }));
// //   }

// //   // Redirect
// //   for (let t of redirectTests) {
// //     testResults.push(await runTest({
// //       name: t.name,
// //       fn: async (r) => {
// //         const { finalUrl } = await fetchData(url + t.payload);
// //         if (finalUrl && finalUrl.includes('evil.com')) {
// //           r.success = true; r.details = `redirected to ${finalUrl}`;
// //         }
// //       }
// //     }));
// //   }

// //   // Headers
// //   testResults.push(await runTest({
// //     name: 'Security Headers',
// //     fn: async (r) => {
// //       const { headers } = await fetchData(url);
// //       const missing = [];
// //       for (let [hdr, pat] of Object.entries(headerTests)) {
// //         if (!headers[hdr.toLowerCase()] || !pat.test(headers[hdr.toLowerCase()])) missing.push(hdr);
// //       }
// //       if (missing.length) {
// //         r.success = true;
// //         r.details = `missing or weak: ${missing.join(', ')}`;
// //       }
// //     }
// //   }));

// //   // Directory Traversal
// //   for (let t of dtTests) {
// //     testResults.push(await runTest({
// //       name: t.name,
// //       fn: async (r) => {
// //         const { data } = await fetchData(`${url}/${encodeURIComponent(t.payload)}`);
// //         if (t.detect.test(data)) {
// //           r.success = true; r.details = `payload=${t.payload}`;
// //         }
// //       }
// //     }));
// //   }

// //   // Sensitive data
// //   testResults.push(await runTest({
// //     name: 'Sensitive Data Leak',
// //     fn: async (r) => {
// //       const { data } = await fetchData(url);
// //       const found = sensitiveKeywords.filter(k => data.toLowerCase().includes(k));
// //       if (found.length) {
// //         r.success = true; r.details = `keywords: ${found.join(', ')}`;
// //       }
// //     }
// //   }));

// //   // SSL/TLS
// //   testResults.push({
// //     name: 'HTTPS Enforced',
// //     applied: true,
// //     success: !url.startsWith('https://'),
// //     details: url.startsWith('https://') ? 'OK' : 'uses HTTP'
// //   });

// //   // Final status
// //   const attacked = testResults.some(t => t.success);
// //   const status = attacked ? 'ATTACKED' : 'SAFE';

// //   // persist
// //   await new ScanResult({ url, date: new Date(), status, testResults }).save();

// //   // respond
// //   res.json({ url, date: new Date(), status, testResults });
// // });

// // // ── HISTORY ────────────────────────────────────────────────────────────────
// // app.get('/api/history', async (req, res) => {
// //   try {
// //     const h = await ScanResult.find().sort({ date: -1 });
// //     res.json(h);
// //   } catch (e) {
// //     res.status(500).json({ error: e.message });
// //   }
// // });

// // // ── PDF ROUTE (unchanged) ──────────────────────────────────────────────────
// // // … your existing /api/generate-pdf here …
// // app.post('/api/generate-pdf', async (req, res) => {
// //   const { url, vulnerabilities, date } = req.body;
// //   if (!url || !Array.isArray(vulnerabilities) || !date) {
// //     return res.status(400).json({ error: 'Missing data for PDF' });
// //   }

// //   const exactMap = {
// //     'SSL/TLS issue: HTTPS not used':
// //       'Enable HTTPS and redirect HTTP to HTTPS with strong ciphers.',
// //   };
// //   const headerMap = {
// //     'content-security-policy':
// //       'Add a strict Content-Security-Policy header.',
// //     'strict-transport-security':
// //       'Implement HSTS with a long max-age.',
// //     'x-content-type-options':
// //       'Add X-Content-Type-Options: nosniff.',
// //     'x-frame-options':
// //       'Add X-Frame-Options to prevent clickjacking.',
// //     'referrer-policy':
// //       'Add Referrer-Policy: no-referrer.'
// //   };

// //   const doc = new PDFDocument({ margin:50, size:'A4' });
// //   res.setHeader('Content-Type','application/pdf');
// //   res.setHeader('Content-Disposition',`attachment; filename="report-${Date.now()}.pdf"`);
// //   doc.pipe(res);

// //   doc.fontSize(20).text('Vulnerability Scan Report', { align:'center' }).moveDown();
// //   doc.fontSize(12).text(`Date: ${new Date(date).toLocaleString()}`);
// //   doc.text(`Target: ${url}`).moveDown();

// //   doc.fontSize(16).text('Findings:',{underline:true});
// //   vulnerabilities.length
// //     ? vulnerabilities.forEach((v,i) => doc.text(`${i+1}. ${v}`))
// //     : doc.text('No vulnerabilities found.');
// //   doc.moveDown();

// //   if (vulnerabilities.length) {
// //     doc.fontSize(16).text('Recommendations:',{underline:true});
// //     const seen = new Set();
// //     vulnerabilities.forEach(v => {
// //       let rec = exactMap[v] || headerMap[v.split(' ')[0].toLowerCase()] ||
// //                 (v.includes('XSS') ? 'Sanitize all user inputs and enforce CSP.' :
// //                 v.includes('SQL') ? 'Use parameterized queries and ORM.' :
// //                 'Review and fix this issue.');
// //       if (!seen.has(rec)) {
// //         seen.add(rec);
// //         doc.list([rec]).moveDown(0.5);
// //       }
// //     });
// //   }

// //   doc.fontSize(10).text('Generated by Web App Vulnerability Scanner',{align:'center'});
// //   doc.end();
// // });

// // // ── START SERVER ─────────────────────────────────────────────────────────
// // const PORT = process.env.PORT || 1121;
// // app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));


// // server.js
// require('dotenv').config();
// const express     = require('express');
// const cors        = require('cors');
// const axios       = require('axios');
// const mongoose    = require('mongoose');
// const bodyParser  = require('body-parser');
// const helmet      = require('helmet');
// const morgan      = require('morgan');
// const rateLimit   = require('express-rate-limit');
// const { URL }     = require('url');
// const dns         = require('dns').promises;
// const Joi         = require('joi');
// const cheerio     = require('cheerio');
// const ScanResult  = require('./models/scanResult.js');
// const PDFDocument = require('pdfkit');

// const app = express();

// // ── GLOBAL MIDDLEWARE ─────────────────────────────────────────────────────
// app.use(cors());
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(helmet());
// app.use(morgan('combined'));
// app.use(rateLimit({
//   windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
//   max:      Number(process.env.RATE_LIMIT_MAX)       || 100,
//   message:  'Too many requests'
// }));

// // ── DATABASE ───────────────────────────────────────────────────────────────
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✔ MongoDB connected'))
//   .catch(e => console.error('✘ MongoDB error', e));

// // ── URL VALIDATION ─────────────────────────────────────────────────────────
// const privateRanges = [
//   /^10\./, /^127\./, /^192\.168\./,
//   /^172\.(1[6-9]|2\d|3[0-1])\./,
//   /^fc00:/, /^fe80:/
// ];
// async function validateUrl(req, res, next) {
//   const schema = Joi.object({ url: Joi.string().uri({ scheme: ['http','https'] }).required() });
//   const { error, value } = schema.validate(req.body);
//   if (error) return res.status(400).json({ error: 'Invalid URL' });

//   try {
//     const { hostname, port } = new URL(value.url);
//     if (port && !['80','443'].includes(port))
//       return res.status(400).json({ error: 'Custom ports not allowed' });

//     const addrs = await dns.lookup(hostname, { all: true });
//     for (let { address } of addrs)
//       if (privateRanges.some(rx => rx.test(address)))
//         return res.status(400).json({ error: 'URL resolves to private network' });

//   } catch {
//     return res.status(400).json({ error: 'Cannot resolve hostname' });
//   }

//   req.safeUrl = value.url;
//   next();
// }

// // ── AXIOS INSTANCE ────────────────────────────────────────────────────────
// const http = axios.create({ timeout: 5000, maxRedirects: 0, maxContentLength: 1_000_000 });

// // ── PAYLOAD LIBRARIES ─────────────────────────────────────────────────────
// const sqlTests = [
//   { name: 'Error-based SQLi',       payload: "' OR '1'='1",                   detect: /SQL syntax|SQL error/i },
//   { name: 'Union-based SQLi',       payload: "' UNION SELECT NULL,version()--", detect: /PostgreSQL|MySQL|SQLite/i },
//   { name: 'Time-based Blind SQLi',  payload: "' AND SLEEP(5)--",              type: 'blind-time', threshold: 4000 },
//   { name: 'Schema Enumeration',     payload: "' UNION SELECT table_name,NULL FROM information_schema.tables--", detect: /table_name/i }
// ];
// const xssTests = [
//   { name: 'Script-injection XSS', payload: '<script>alert(1)</script>',           detect: /<script>/i },
//   { name: 'Event-handler XSS',    payload: '" onmouseover=alert(1) x="',          detectAttr: 'onmouseover' },
//   { name: 'SVG XSS',              payload: '<svg><script>alert(1)</script></svg>',  detect: /<svg>/i },
//   { name: 'JS-context XSS',       payload: `"}];alert(1);//`,                      detect: /alert\(1\)/i }
// ];
// const redirectTests = [
//   { name: 'Open Redirect',    payload: '/redirect?url=https://evil.com' },
//   { name: 'Encoded Redirect', payload: '/redirect?url=%2F%2Fevil.com' }
// ];
// const headerTests = {
//   'Content-Security-Policy':   /default-src 'self'/,
//   'Strict-Transport-Security': /max-age=\d+/,
//   'X-Content-Type-Options':    /nosniff/,
//   'X-Frame-Options':           /DENY|SAMEORIGIN/,
//   'Referrer-Policy':           /no-referrer/
// };
// const dtTests = [
//   { name: 'passwd Traversal', payload: '../etc/passwd',   detect: /root:/ },
//   { name: 'shadow Traversal', payload: '../../etc/shadow', detect: /shadow:/ }
// ];
// const sensitiveKeywords = ['api_key','secret','token','password'];

// // ── HELPERS ────────────────────────────────────────────────────────────────
// async function fetchData(u) {
//   try {
//     const r = await http.get(u);
//     return { data: r.data, headers: r.headers, finalUrl: r.request.res.responseUrl };
//   } catch {
//     return { data: '', headers: {}, finalUrl: null };
//   }
// }

// // run and record a single test, with console logging
// async function runTest({ name, fn }) {
//   console.log(`→ [${name}] starting`);
//   const result = { name, applied: true, success: false, details: '' };
//   try {
//     await fn(result);
//   } catch (e) {
//     result.success = false;
//     result.details = `Error: ${e.message}`;
//   }
//   console.log(`← [${name}] applied=${result.applied} success=${result.success} details="${result.details}"`);
//   return result;
// }

// // ── SCAN ROUTE ────────────────────────────────────────────────────────────
// app.post('/api/scan', validateUrl, async (req, res) => {
//   const url = req.safeUrl;
//   console.log(`\n=== New scan for ${url} at ${new Date().toISOString()} ===`);
//   const testResults = [];

//   // SQLi
//   for (let t of sqlTests) {
//     testResults.push(await runTest({
//       name: t.name,
//       fn: async (r) => {
//         const start = Date.now();
//         const { data } = await fetchData(`${url}?id=${encodeURIComponent(t.payload)}`);
//         const dur = Date.now() - start;
//         if (t.type === 'blind-time') {
//           if (dur > t.threshold) {
//             r.success = true;
//             r.details = `delay ${dur}ms`;
//           }
//         } else if (t.detect && t.detect.test(data)) {
//           r.success = true;
//           r.details = `payload=${t.payload}`;
//         }
//       }
//     }));
//   }

//   // XSS
//   for (let t of xssTests) {
//     testResults.push(await runTest({
//       name: t.name,
//       fn: async (r) => {
//         const { data } = await fetchData(`${url}?q=${encodeURIComponent(t.payload)}`);
//         const $ = cheerio.load(data);
//         if ((t.detect && t.detect.test(data)) || (t.detectAttr && $(`[${t.detectAttr}]`).length)) {
//           r.success = true;
//           r.details = `payload=${t.payload}`;
//         }
//       }
//     }));
//   }

//   // Redirect
//   for (let t of redirectTests) {
//     testResults.push(await runTest({
//       name: t.name,
//       fn: async (r) => {
//         const { finalUrl } = await fetchData(url + t.payload);
//         if (finalUrl && finalUrl.includes('evil.com')) {
//           r.success = true;
//           r.details = `redirected to ${finalUrl}`;
//         }
//       }
//     }));
//   }

//   // Headers
//   testResults.push(await runTest({
//     name: 'Security Headers',
//     fn: async (r) => {
//       const { headers } = await fetchData(url);
//       const missing = [];
//       for (let [hdr, pat] of Object.entries(headerTests)) {
//         if (!headers[hdr.toLowerCase()] || !pat.test(headers[hdr.toLowerCase()])) {
//           missing.push(hdr);
//         }
//       }
//       if (missing.length) {
//         r.success = true;
//         r.details = `missing or weak: ${missing.join(', ')}`;
//       }
//     }
//   }));

//   // Directory Traversal
//   for (let t of dtTests) {
//     testResults.push(await runTest({
//       name: t.name,
//       fn: async (r) => {
//         const { data } = await fetchData(`${url}/${encodeURIComponent(t.payload)}`);
//         if (t.detect.test(data)) {
//           r.success = true;
//           r.details = `payload=${t.payload}`;
//         }
//       }
//     }));
//   }

//   // Sensitive data
//   testResults.push(await runTest({
//     name: 'Sensitive Data Leak',
//     fn: async (r) => {
//       const { data } = await fetchData(url);
//       const found = sensitiveKeywords.filter(k => data.toLowerCase().includes(k));
//       if (found.length) {
//         r.success = true;
//         r.details = `keywords: ${found.join(', ')}`;
//       }
//     }
//   }));

//   // SSL/TLS
//   const httpsTest = {
//     name: 'HTTPS Enforced',
//     applied: true,
//     success: !url.startsWith('https://'),
//     details: url.startsWith('https://') ? 'OK' : 'uses HTTP'
//   };
//   console.log(`← [HTTPS Enforced] applied=${httpsTest.applied} success=${httpsTest.success} details="${httpsTest.details}"`);
//   testResults.push(httpsTest);

//   // Final status
//   const attacked = testResults.some(t => t.success);
//   const status = attacked ? 'ATTACKED' : 'SAFE';
//   console.log(`=== Scan complete: status=${status} ===\n`);

//   // persist
//   await new ScanResult({ url, date: new Date(), status, testResults }).save();

//   // respond
//   res.json({ url, date: new Date(), status, testResults });
// });

// // ── HISTORY ────────────────────────────────────────────────────────────────
// app.get('/api/history', async (req, res) => {
//   try {
//     const h = await ScanResult.find().sort({ date: -1 });
//     res.json(h);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// // ── PDF ROUTE ──────────────────────────────────────────────────────────────
// app.post('/api/generate-pdf', async (req, res) => {
//   // ... your existing PDF generation code unchanged ...
// });

// // ── START SERVER ─────────────────────────────────────────────────────────
// const PORT = process.env.PORT || 1121;
// app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));


// server.js
require('dotenv').config();
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
const CrawlResult   = require('./models/crawlResult.js');
const PDFDocument   = require('pdfkit');
const puppeteer     = require('puppeteer');

const app = express();

/** ── GLOBAL MIDDLEWARE ───────────────────────────────────────────── */
app.use(cors({ origin: 'https://app-scanner1.vercel.app/' }));
app.use(bodyParser.json({ limit: '1000kb' }));
// CORS — restrict origins as needed
app.use(cors({  }));
// Body parser with size limit
app.use(bodyParser.json({ limit: '100000kb' }));
// Security headers
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs:   Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:        Number(process.env.RATE_LIMIT_MAX)       || 200,
  message:    'Too many requests, please try again later.'
}));

/** ── DATABASE CONNECTION ─────────────────────────────────────────── */
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

/** ── URL VALIDATION & SSRF PROTECTION ───────────────────────────── */
const validateUrl = async (req, res, next) => {
  const raw = req.body.url;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return res.status(400).json({ error: 'Missing or empty URL' });
  }

  const { error, value } = Joi.string().uri({ scheme: [/https?/] }).required().validate(raw);
  if (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  let urlObj;
  try {
    urlObj = new URL(value);
  } catch {
    return res.status(400).json({ error: 'Unable to parse URL' });
  }

  try {
    const addrs = await dns.lookup(urlObj.hostname, { all: true });
    for (const { address } of addrs) {
      if (
        address.startsWith('10.') ||
        address.startsWith('192.168.') ||
        address.startsWith('127.') ||
        address.startsWith('172.16.')
      ) {
        return res.status(400).json({ error: 'URL resolves to private/loopback address' });
      }
    }
  } catch {
    return res.status(400).json({ error: 'DNS resolution failed' });
  }

  req.safeUrl = urlObj.toString();
  next();
};

/** ── SCAN ROUTES ─────────────────────────────────────────────────── */
// Basic vulnerability scanner
app.post('/api/scan', validateUrl, async (req, res) => {
  const url = req.safeUrl;
  const vulnerabilities = [];
  const xssResults = [];

  const http = axios.create({ timeout: 5000, maxRedirects: 0, maxContentLength: 1_000_000 });
  const sqlPayloads = ["' OR '1'='1", "' OR 'a'='a"];
  const xssPayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
  const dirTraversal = ['../etc/passwd', '../../etc/shadow'];
  const openRedirect = '/redirect?url=https://evil.com';
  const keywords = ['api_key','password','secret','token'];
  const headersReq = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy'
  ];
  const isHttps = u => u.startsWith('https');

  const fetchData = async t => {
    try { const r = await http.get(t); return { data: r.data, headers: r.headers, finalUrl: r.request.res.responseUrl }; }
    catch { return { data:'', headers:{}, finalUrl:null }; }
  };

  // SQLi
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
    const detected = data.includes(p);
    xssResults.push({ payload: p, detected });
    if (detected && !vulnerabilities.includes('XSS vulnerability detected')) {
      vulnerabilities.push('XSS vulnerability detected');
    }
  }

  // Open Redirect
  { const { finalUrl } = await fetchData(`${url}${openRedirect}`);
    if (finalUrl?.includes('evil.com')) vulnerabilities.push('Open Redirect vulnerability detected');
  }

  // Dir Traversal
  for (let p of dirTraversal) {
    const { data } = await fetchData(`${url}/${encodeURIComponent(p)}`);
    if (data.includes('root:')||data.includes('shadow:')) {
      vulnerabilities.push('Directory Traversal vulnerability detected');
      break;
    }
  }

  // Sensitive / Headers
  { const { data, headers } = await fetchData(url);
    const lc = data.toLowerCase();
    keywords.forEach(k => { if (lc.includes(k)) vulnerabilities.push(`Sensitive Information Exposure: ${k} found`); });
    headersReq.forEach(h => { if (!headers[h]) vulnerabilities.push(`${h} header missing`); });
  }

  if (!isHttps(url)) vulnerabilities.push('SSL/TLS Configuration Issue: HTTPS not used');

  await new ScanResult({ url, vulnerabilities, xssResults, date: new Date() }).save();
  res.json({ message: 'Scan completed', vulnerabilities, xssResults });
});

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
  const exactMap = {
    'SQL Injection vulnerability detected':    'Use parameterized queries or prepared statements.',
    'XSS vulnerability detected':              'Escape or sanitize all user inputs; implement CSP.',
    'Open Redirect vulnerability detected':    'Validate redirect URLs against a whitelist.',
    'Directory Traversal vulnerability detected':'Sanitize file paths and enforce access controls.',
    'SSL/TLS Configuration Issue: HTTPS not used':'Enable HTTPS everywhere and use strong ciphers.'
  };
  const headerRec = {
    'content-security-policy': 'Add CSP header to mitigate XSS.',
    'strict-transport-security':'Implement HSTS for HTTPS enforcement.',
    'x-content-type-options':   'Add nosniff to prevent MIME sniffing.',
    'x-frame-options':          'Add to prevent clickjacking.',
    'referrer-policy':          'Add to control referrer leakage.'
  };

  const doc = new PDFDocument({ margin:50, size:'A4' });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition',`attachment; filename="scan-report_${url.replace(/[^a-z0-9]/gi,'_')}.pdf"`);
  doc.pipe(res);
  doc.fontSize(20).text('Vulnerability Scan Report',{align:'center'}).moveDown();
  doc.fontSize(12).text(`Scan Date: ${new Date(date).toLocaleString()}`);
  doc.text(`Target URL: ${url}`).moveDown();

  doc.fontSize(16).text('Detected Vulnerabilities:',{underline:true});
  if (!vulnerabilities.length) {
    doc.fontSize(12).text('None found.');
  } else {
    vulnerabilities.forEach((v,i) => doc.fontSize(12).text(`${i+1}. ${v}`));
  }
  doc.moveDown();

  if (vulnerabilities.length) {
    doc.fontSize(16).text('Recommendations:',{underline:true});
    const seen = new Set();
    vulnerabilities.forEach(v => {
      let rec = exactMap[v];
      if (!rec && v.endsWith(' header missing')) {
        rec = headerRec[v.split(' ')[0].toLowerCase()];
      }
      if (rec && !seen.has(rec)) {
        seen.add(rec);
        doc.fontSize(12).list([rec]);
      }
    });
  }

  doc.moveDown();
  doc.fontSize(10).text('Generated by Web App Vulnerability Scanner',{align:'center'});
  doc.end();
});

/** ── CRAWL & XSS TEST ROUTE ──────────────────────────────────────── */
app.post('/api/crawl', validateUrl, async (req, res) => {
  const startUrl  = req.safeUrl;
  const maxDepth  = Number(process.env.CRAWL_DEPTH) || 2;
  const hostname  = new URL(startUrl).hostname;

  const visited = new Set();
  const queue   = [{ url: startUrl, depth: 0 }];
  const results = [];

  const xssPayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];

  const browser = await puppeteer.launch();
  const page    = await browser.newPage();

  while (queue.length) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > maxDepth) continue;
    visited.add(url);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch {
      continue;
    }

    // extract inputs
    const inputs = await page.$$eval('input, textarea, select, form', els =>
      els.map((el,i) => ({
        index:   i,
        tag:     el.tagName.toLowerCase(),
        name:    el.getAttribute('name') || '',
        snippet: el.outerHTML.slice(0,100)
      }))
    );

    const xssResults = [];
    if (inputs.length) {
      for (const fld of inputs) {
        for (const p of xssPayloads) {
          let detected = false;
          try {
            const sep     = url.includes('?') ? '&' : '?';
            const testUrl = `${url}${sep}${encodeURIComponent(fld.name)}=${encodeURIComponent(p)}`;
            await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 8000 });
            const content = await page.content();
            detected = content.includes(p);
          } catch {
            detected = false;
          }
          xssResults.push({ fieldIndex: fld.index, payload: p, detected });
        }
      }
      results.push({ url, inputs, xssResults });
    }

    // enqueue links
    const links = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    for (let href of links) {
      try {
        href = new URL(href, url).toString();
        if (new URL(href).hostname === hostname && !visited.has(href)) {
          queue.push({ url: href, depth: depth + 1 });
        }
      } catch {}
    }
  }

  await browser.close();

  // save full pages array with inputs & xssResults
  const cr = new CrawlResult({
    url:   startUrl,
    depth: maxDepth,
    pages: results
  });
  await cr.save();

  res.json({ pages: results });
});

app.get('/api/crawl-history', async (req, res) => {
  try {
    const history = await CrawlResult.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ── START SERVER ───────────────────────────────────────────────── */
const PORT = process.env.PORT || 1121;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
