// Vercel serverless function to handle whitelist updates
const https = require('https');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in Vercel environment variables
    const GITHUB_USERNAME = 'ZH0ST';
    const REPO_NAME = 'key';
    const FILE_PATH = 'whitelisted-users.json';
    
    const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
    const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;
    
    if (req.method === 'GET') {
        // Get current whitelist
        try {
            const response = await fetch(RAW_URL + '?t=' + Date.now());
            const data = await response.json();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch whitelist' });
        }
    }
    
    else if (req.method === 'POST') {
        // Update whitelist
        try {
            const { action, userId, username } = req.body;
            
            // Get current file
            const fileResponse = await fetch(API_URL, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            const fileData = await fileResponse.json();
            
            // Decode current content
            const currentContent = Buffer.from(fileData.content, 'base64').toString();
            const currentData = JSON.parse(currentContent);
            
            if (action === 'add') {
                // Add user
                if (currentData.users.some(u => u.userId === userId)) {
                    return res.json({ success: false, error: 'User already exists' });
                }
                
                currentData.users.push({
                    userId,
                    username,
                    profileImage: `https://tr.rbxcdn.com/${userId}/150/150/Image/Png`,
                    addedAt: new Date().toISOString(),
                    addedBy: 'api'
                });
            }
            else if (action === 'remove') {
                // Remove user
                currentData.users = currentData.users.filter(u => u.userId !== userId);
            }
            
            currentData.lastUpdated = new Date().toISOString();
            
            // Update file
            const newContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
            
            const updateResponse = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Whitelist update: ${action} ${userId}`,
                    content: newContent,
                    sha: fileData.sha
                })
            });
            
            if (updateResponse.ok) {
                res.json({ success: true });
            } else {
                res.json({ success: false, error: 'GitHub update failed' });
            }
            
        } catch (error) {
            console.error('API error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
