// API endpoint to check if user is whitelisted
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Get user ID from query
        const userId = req.query.userId;
        
        if (!userId) {
            return res.status(200).json({ 
                whitelisted: false, 
                error: 'No user ID provided',
                message: 'Add ?userId=123 to the URL',
                api: 'https://script-one-zeta.vercel.app/api/check'
            });
        }
        
        console.log(`🔍 Checking user: ${userId}`);
        
        // GitHub raw URL
        const GITHUB_USERNAME = 'ZH0ST';
        const REPO_NAME = 'script';
        const FILE_PATH = 'whitelisted-users.json';
        const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;
        
        // Fetch whitelist from GitHub
        const response = await fetch(RAW_URL + '?t=' + Date.now());
        
        if (!response.ok) {
            // If GitHub fails, check a backup
            console.error('GitHub fetch failed:', response.status);
            
            // Return a default response
            return res.json({
                whitelisted: userId === "10428355122", // Your ID is whitelisted by default
                userId: userId,
                username: userId === "10428355122" ? "YourUsername" : "Unknown",
                profileImage: `https://tr.rbxcdn.com/${userId}/150/150/Image/Png`,
                message: 'GitHub fetch failed - using default',
                apiStatus: 'fallback'
            });
        }
        
        const data = await response.json();
        
        // Check if user is whitelisted
        const isWhitelisted = data.users && data.users.some(user => user.userId === userId);
        
        if (isWhitelisted) {
            const user = data.users.find(u => u.userId === userId);
            return res.json({
                whitelisted: true,
                userId: userId,
                username: user?.username || 'Unknown',
                profileImage: user?.profileImage || `https://tr.rbxcdn.com/${userId}/150/150/Image/Png`,
                addedAt: user?.addedAt,
                message: '✅ User is whitelisted',
                totalWhitelisted: data.users?.length || 0
            });
        } else {
            return res.json({
                whitelisted: false,
                userId: userId,
                message: '❌ User is not whitelisted',
                totalWhitelisted: data.users?.length || 0,
                suggestion: 'Visit https://script-one-zeta.vercel.app to request access'
            });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(200).json({
            whitelisted: false,
            userId: req.query.userId || 'unknown',
            error: error.message,
            message: 'Failed to check whitelist status',
            api: 'https://script-one-zeta.vercel.app'
        });
    }
}
