// Whitelist management API (for future updates)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    return res.json({
        api: 'Whitelist Manager',
        version: '1.0',
        endpoints: {
            check: '/api/check?userId=123',
            dashboard: 'https://script-one-zeta.vercel.app'
        },
        status: 'operational',
        message: 'Use /api/check to verify users'
    });
}
