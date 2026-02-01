# Whitelist System

A complete whitelist system for Roblox scripts with web dashboard.

## Files:
- `index.html` - Dashboard website
- `whitelisted-users.json` - Whitelist database
- `/api/check.js` - API endpoint for Roblox
- `/api/whitelist.js` - Management API
- `vercel.json` - Vercel configuration

## Setup:
1. Update `GITHUB_USERNAME` and `REPO_NAME` in index.html (line 73-74)
2. Update `API_URL` in Roblox script (line 8)
3. Deploy to Vercel
4. Add your User ID via dashboard
5. Use the Roblox script

## Dashboard URL:
https://your-vercel-url.vercel.app
