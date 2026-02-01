// Simple API endpoint to check if user is whitelisted
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
            return res.status(400).json({ 
                whitelisted: false, 
                error: 'No user ID provided',
                message: 'Add ?userId=123 to the URL' 
            });
        }
        
        // GitHub raw URL
        const GITHUB_USERNAME = 'ZH0ST';
        const REPO_NAME = 'script';
        const FILE_PATH = 'whitelisted-users.json';
        const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;
        
        console.log(`Checking user ${userId} from ${RAW_URL}`);
        
        // Fetch whitelist
        const response = await fetch(RAW_URL + '?t=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`Failed to fetch whitelist: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if user is whitelisted
        const isWhitelisted = data.users.some(user => user.userId === userId);
        
        if (isWhitelisted) {
            const user = data.users.find(u => u.userId === userId);
            return res.json({
                whitelisted: true,
                userId: userId,
                username: user?.username || 'Unknown',
                profileImage: user?.profileImage || `https://tr.rbxcdn.com/${userId}/150/150/Image/Png`,
                addedAt: user?.addedAt,
                message: 'User is whitelisted'
            });
        } else {
            return res.json({
                whitelisted: false,
                userId: userId,
                message: 'User is not whitelisted',
                totalWhitelisted: data.users.length
            });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            whitelisted: false,
            error: error.message,
            message: 'Failed to check whitelist status'
        });
    }
}
