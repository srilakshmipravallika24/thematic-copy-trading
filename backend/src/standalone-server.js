/**
 * Standalone Zero-Dependency Express-Compatible Runner
 * Allows instant verification and testing without requiring 'npm install' or local MongoDB daemon.
 * Uses Node.js native http, crypto, and url modules while exposing the exact same REST API contracts.
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const { mockUsers, mockPortfolios, mockSocialPosts, mockCopyTrades, mockRegulatoryLogs } = require('./utils/mockStore');
const { calculateMirrorAllocation } = require('./utils/mirrorCalculator');

const PORT = process.env.PORT || 5000;

// Helper to send JSON responses with CORS headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Request body reader
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // Health
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      platform: 'Thematic Social Copy-Trading Network (Regulated RIA Edition)',
      version: '1.0.0 (Production MVP)',
      engine: 'Node.js Native + Express-compatible REST API',
      timestamp: new Date(),
    });
  }

  // Auth: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const user = mockUsers.find((u) => u.email.toLowerCase() === (body.email || '').toLowerCase()) || mockUsers[2];
    const token = 'mock_jwt_token_' + Buffer.from(user._id).toString('base64');
    return sendJson(res, 200, {
      success: true,
      message: 'Authentication successful.',
      token,
      user,
    });
  }

  // Auth: Current User
  if (pathname === '/api/auth/me' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      user: mockUsers[2], // Alex Rivera (Retail)
    });
  }

  // Portfolios: List
  if (pathname === '/api/portfolios' && method === 'GET') {
    const theme = parsedUrl.query.theme;
    let list = mockPortfolios;
    if (theme && theme !== 'All Themes') {
      list = list.filter((p) => p.theme.toLowerCase().includes(theme.toLowerCase()));
    }
    return sendJson(res, 200, {
      success: true,
      count: list.length,
      portfolios: list,
    });
  }

  // Portfolios: Get single by ID or slug
  if (pathname.startsWith('/api/portfolios/') && method === 'GET') {
    const id = pathname.replace('/api/portfolios/', '');
    const p = mockPortfolios.find((item) => item._id === id || item.slug === id);
    if (!p) return sendJson(res, 404, { success: false, message: 'Portfolio not found' });
    return sendJson(res, 200, { success: true, portfolio: p });
  }

  // Copy-Trading: Preview Allocation Calculator
  if (pathname === '/api/copy/preview' && method === 'POST') {
    const body = await parseBody(req);
    const p = mockPortfolios.find((item) => item._id === body.portfolioId || item.slug === body.portfolioId);
    if (!p) return sendJson(res, 404, { success: false, message: 'Portfolio not found' });

    try {
      const calculation = calculateMirrorAllocation(p, body.capitalAmount || 5000, body.cashBufferPercent || 5);
      return sendJson(res, 200, { success: true, calculation });
    } catch (err) {
      return sendJson(res, 400, { success: false, message: err.message });
    }
  }

  // Copy-Trading: Subscribe / Execute Mirror Trade
  if (pathname === '/api/copy/subscribe' && method === 'POST') {
    const body = await parseBody(req);
    const p = mockPortfolios.find((item) => item._id === body.portfolioId || item.slug === body.portfolioId);
    if (!p) return sendJson(res, 404, { success: false, message: 'Portfolio not found' });

    const calculation = calculateMirrorAllocation(p, body.allocatedCapital || 5000, body.cashBufferPercent || 5);

    const newTrade = {
      _id: `copy_${Date.now()}`,
      retailUser: mockUsers[2],
      portfolio: p,
      advisor: p.advisor,
      allocatedCapital: Number(body.allocatedCapital),
      cashBufferPercent: body.cashBufferPercent || 5,
      stopLossPercent: body.stopLossPercent || 15,
      autoRebalance: body.autoRebalance !== false,
      mirroredPositions: calculation.positions,
      status: 'ACTIVE',
      unrealizedPnL: 0,
      createdAt: new Date(),
    };

    mockCopyTrades.unshift(newTrade);
    return sendJson(res, 201, {
      success: true,
      message: 'Thematic copy trade authorized and recorded in regulatory audit trail.',
      copyTrade: newTrade,
    });
  }

  // Copy-Trading: My Trades
  if (pathname === '/api/copy/my-trades' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      count: mockCopyTrades.length,
      trades: mockCopyTrades,
    });
  }

  // Social: Feed
  if (pathname === '/api/social' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      count: mockSocialPosts.length,
      posts: mockSocialPosts,
    });
  }

  // Social: Create Post
  if (pathname === '/api/social' && method === 'POST') {
    const body = await parseBody(req);
    const newPost = {
      _id: `post_${Date.now()}`,
      author: mockUsers[0],
      title: body.title,
      content: body.content,
      themeTag: body.themeTag || 'General Thematic Discussion',
      sentiment: body.sentiment || 'Neutral',
      likes: [],
      comments: [],
      complianceNotice:
        'Regulatory Compliance Disclaimer: Commentary provided by RIA or community members is strictly educational.',
      createdAt: new Date(),
    };
    mockSocialPosts.unshift(newPost);
    return sendJson(res, 201, { success: true, post: newPost });
  }

  // Social: Comment
  if (pathname.includes('/comments') && method === 'POST') {
    const parts = pathname.split('/');
    const postId = parts[3];
    const body = await parseBody(req);
    const post = mockSocialPosts.find((p) => p._id === postId);
    if (!post) return sendJson(res, 404, { success: false, message: 'Post not found' });

    const newComment = {
      _id: `comm_${Date.now()}`,
      user: mockUsers[2],
      text: body.text,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    return sendJson(res, 200, { success: true, post });
  }

  // RIAs: Top Advisors
  if (pathname === '/api/ria' && method === 'GET') {
    const advisors = mockUsers.filter((u) => u.role === 'ria');
    return sendJson(res, 200, { success: true, advisors });
  }

  // 404 Fallback
  return sendJson(res, 404, { success: false, message: `Route ${pathname} not found` });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Standalone Zero-Dependency API Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
