// API for managing whitelist (optional - for future features)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // For now, just return info
    return res.json({
        api: 'Whitelist Manager API',
        version: '1.0',
        endpoints: {
            check: '/api/check?userId=123',
            dashboard: '/'
        },
        repository: 'https://github.com/ZH0ST/script'
    });
}
