import  { useState } from 'react';

const Settings = () => {
    // State for form inputs
    const [sqlInjection, setSqlInjection] = useState(true);
    const [xss, setXss] = useState(true);
    const [dirTraversal, setDirTraversal] = useState(true);
    const [openRedirect, setOpenRedirect] = useState(true);
    const [sslCheck, setSslCheck] = useState(true);
    const [sensitiveInfoExposure, setSensitiveInfoExposure] = useState(true);
    const [maliciousFileUpload, setMaliciousFileUpload] = useState(true);
    const [scanDepth, setScanDepth] = useState(2); // Depth of scanning
    const [notificationEmail, setNotificationEmail] = useState('');
    const [headersToCheck, setHeadersToCheck] = useState({
        'content-security-policy': true,
        'strict-transport-security': true,
        'x-content-type-options': true,
        'x-frame-options': true,
        'referrer-policy': true,
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const settingsData = {
            sqlInjection,
            xss,
            dirTraversal,
            openRedirect,
            sslCheck,
            sensitiveInfoExposure,
            maliciousFileUpload,
            scanDepth,
            notificationEmail,
            headersToCheck,
        };
        // You can send this data to the backend or save it in local storage
        console.log('Settings saved:', settingsData);
        alert('Settings saved successfully!');
    };

    return (
        <div className="bg-teal-950 text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform ">
            <h1 className="text-4xl font-bold mb-6">Settings</h1>
            <p className="mb-6">Adjust scanning preferences and configurations here.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* SQL Injection */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={sqlInjection}
                        onChange={() => setSqlInjection(!sqlInjection)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable SQL Injection Check</label>
                </div>

                {/* XSS */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={xss}
                        onChange={() => setXss(!xss)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable XSS Check</label>
                </div>

                {/* Directory Traversal */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={dirTraversal}
                        onChange={() => setDirTraversal(!dirTraversal)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable Directory Traversal Check</label>
                </div>

                {/* Open Redirect */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={openRedirect}
                        onChange={() => setOpenRedirect(!openRedirect)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable Open Redirect Check</label>
                </div>

                {/* SSL Check */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={sslCheck}
                        onChange={() => setSslCheck(!sslCheck)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable SSL/TLS Check</label>
                </div>

                {/* Sensitive Info Exposure */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={sensitiveInfoExposure}
                        onChange={() => setSensitiveInfoExposure(!sensitiveInfoExposure)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable Sensitive Information Exposure Check</label>
                </div>

                {/* Malicious File Upload */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={maliciousFileUpload}
                        onChange={() => setMaliciousFileUpload(!maliciousFileUpload)}
                        className="mr-2"
                    />
                    <label className="text-xl">Enable Malicious File Upload Check</label>
                </div>

                {/* Scan Depth */}
                <div className="flex items-center space-x-4">
                    <label className="text-xl">Scan Depth:</label>
                    <input
                        type="number"
                        value={scanDepth}
                        onChange={(e) => setScanDepth(parseInt(e.target.value))}
                        className="text-black p-2 rounded-md"
                        min="1"
                        max="10"
                    />
                </div>

                {/* Security Headers Check */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold mt-4">Security Headers to Check:</h2>
                    {Object.keys(headersToCheck).map((header) => (
                        <div key={header} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={headersToCheck[header]}
                                onChange={() =>
                                    setHeadersToCheck({ ...headersToCheck, [header]: !headersToCheck[header] })
                                }
                                className="mr-2"
                            />
                            <label className="text-xl capitalize">{header.replace(/-/g, ' ')}</label>
                        </div>
                    ))}
                </div>

                {/* Notification Email */}
                <div className="flex flex-col space-y-2 border-green-600">
                    <label className="text-xl">Notification Email:</label>
                    <input 
                        type="email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        className="text-black p-2 rounded-md "
                        placeholder="Enter your email to receive scan notifications"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-2 px-4 rounded-md transition duration-300"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default Settings;
