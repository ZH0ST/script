// API endpoint for Roblox to check if user is whitelisted
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const GITHUB_USERNAME = 'ZH0ST';
    const REPO_NAME = 'key';
    const FILE_PATH = 'whitelisted-users.json';
    const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;
    
    try {
        // Get user ID from query parameter
        const userId = req.query.userId;
        
        if (!userId) {
            return res.json({ whitelisted: false, error: 'No user ID provided' });
        }
        
        // Fetch whitelist
        const response = await fetch(RAW_URL + '?t=' + Date.now());
        const data = await response.json();
        
        // Check if user is whitelisted
        const isWhitelisted = data.users.some(user => user.userId === userId);
        
        if (isWhitelisted) {
            const user = data.users.find(u => u.userId === userId);
            res.json({
                whitelisted: true,
                userId: userId,
                username: user?.username || 'Unknown',
                profileImage: user?.profileImage
            });
        } else {
            res.json({
                whitelisted: false,
                userId: userId
            });
        }
        
    } catch (error) {
        console.error('Check error:', error);
        res.json({ whitelisted: false, error: 'Failed to check whitelist' });
    }
};
