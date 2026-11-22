/**
 * In-Memory Mock Store for Frontend Fallback & Initial State
 * Populated with realistic Registered Investment Advisor (RIA) profiles and thematic baskets.
 */

export const mockUsers = [
  {
    _id: 'usr_ria_001',
    name: 'Sarah Chen, CFA',
    email: 'sarah.chen@apexwealth.com',
    role: 'ria',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    riskProfile: 'Moderate',
    portfolioBalance: 850000,
    isKYCCompleted: true,
    riaProfile: {
      crdNumber: 'CRD-6894021',
      firmName: 'Apex Thematic Asset Management LLC',
      isVerified: true,
      aum: 184000000, // $184M AUM
      experienceYears: 14,
      bio: 'Former senior quantitative equity strategist at BlackRock. Specializes in disruptive AI infrastructure, compute fabrics, and enterprise software valuation.',
      accreditations: ['CFA', 'Series 65', 'Series 7'],
      followerCount: 14820,
      rating: 4.9,
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: 'usr_ria_002',
    name: 'David Sterling, CFP',
    email: 'd.sterling@greenhorizon.org',
    role: 'ria',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    riskProfile: 'Aggressive',
    portfolioBalance: 420000,
    isKYCCompleted: true,
    riaProfile: {
      crdNumber: 'CRD-5902143',
      firmName: 'Horizon Sustainable Capital',
      isVerified: true,
      aum: 92000000, // $92M AUM
      experienceYears: 11,
      bio: 'Leading clean energy and decarbonization thematic advisor. Focused on utility-scale solar, battery storage, and next-gen nuclear power.',
      accreditations: ['CFP', 'CFA Level III', 'Series 65'],
      followerCount: 9640,
      rating: 4.8,
    },
    createdAt: new Date('2024-02-10'),
  },
  {
    _id: 'usr_retail_001',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'retail',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    riskProfile: 'Moderate',
    portfolioBalance: 32500,
    isKYCCompleted: true,
    riaProfile: null,
    createdAt: new Date('2024-03-01'),
  },
];

export const mockPortfolios = [
  {
    _id: 'port_001',
    title: 'Generative AI & Accelerated Compute Core',
    slug: 'gen-ai-compute-core',
    theme: 'Artificial Intelligence & Cloud',
    advisor: mockUsers[0],
    description:
      'A curated institutional basket targeting semiconductor foundries, hyper-scalers, optical networking, and enterprise AI model providers powering the next computing epoch.',
    methodology:
      'High-conviction allocation with quarterly rebalancing based on data center CAPEX spending and free cash flow generation.',
    riskScore: 7,
    allocations: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', targetWeight: 28, currentPrice: 128.5, sector: 'Semiconductors' },
      { symbol: 'MSFT', name: 'Microsoft Corp', targetWeight: 22, currentPrice: 425.2, sector: 'Cloud & Enterprise AI' },
      { symbol: 'TSM', name: 'Taiwan Semiconductor', targetWeight: 18, currentPrice: 172.4, sector: 'Foundry & Fabrication' },
      { symbol: 'AVGO', name: 'Broadcom Inc', targetWeight: 16, currentPrice: 164.8, sector: 'Custom Silicon & Networking' },
      { symbol: 'AMZN', name: 'Amazon.com Inc (AWS)', targetWeight: 16, currentPrice: 186.1, sector: 'Cloud Infrastructure' },
    ],
    metrics: {
      oneMonthReturn: 4.8,
      oneYearReturn: 44.2,
      allTimeReturn: 112.6,
      sharpeRatio: 2.14,
      maxDrawdown: -14.2,
      volatility: 19.4,
      benchmark: 'NASDAQ 100 (QQQ)',
      alphaVsBenchmark: 11.4,
    },
    copiersCount: 1420,
    totalMirroredCapital: 12450000,
    minInvestment: 1000,
    lastRebalanced: new Date('2026-10-15'),
    status: 'ACTIVE',
    regulatoryFormADVUrl: 'https://adviserinfo.sec.gov/firm/summary/184000',
  },
  {
    _id: 'port_002',
    title: 'Clean Energy Transition & Smart Grid Storage',
    slug: 'clean-energy-grid-storage',
    theme: 'Clean Tech & Renewable Energy',
    advisor: mockUsers[1],
    description:
      'Focuses on modern electrical grid modernization, grid-scale battery storage, utility renewable operators, and nuclear SMR energy infrastructure.',
    methodology:
      'Macro thematic approach tracking government clean energy subsidies, IRA incentives, and corporate power purchase agreements (PPAs).',
    riskScore: 6,
    allocations: [
      { symbol: 'NEE', name: 'NextEra Energy', targetWeight: 25, currentPrice: 78.4, sector: 'Renewable Utility' },
      { symbol: 'ENPH', name: 'Enphase Energy', targetWeight: 20, currentPrice: 112.3, sector: 'Solar & Inverters' },
      { symbol: 'CEG', name: 'Constellation Energy', targetWeight: 25, currentPrice: 245.8, sector: 'Clean Nuclear & Power' },
      { symbol: 'FSLR', name: 'First Solar Inc', targetWeight: 15, currentPrice: 215.1, sector: 'Thin-Film Solar' },
      { symbol: 'FLNC', name: 'Fluence Energy', targetWeight: 15, currentPrice: 22.6, sector: 'Battery Energy Storage' },
    ],
    metrics: {
      oneMonthReturn: 2.6,
      oneYearReturn: 24.5,
      allTimeReturn: 58.9,
      sharpeRatio: 1.62,
      maxDrawdown: -16.8,
      volatility: 17.1,
      benchmark: 'S&P 500 (SPY)',
      alphaVsBenchmark: 5.8,
    },
    copiersCount: 840,
    totalMirroredCapital: 6820000,
    minInvestment: 500,
    lastRebalanced: new Date('2026-11-01'),
    status: 'ACTIVE',
    regulatoryFormADVUrl: 'https://adviserinfo.sec.gov/firm/summary/92000',
  },
  {
    _id: 'port_003',
    title: 'Global Cybersecurity & Mission-Critical Defense',
    slug: 'cybersecurity-defense-core',
    theme: 'Cybersecurity & Defense',
    advisor: mockUsers[0],
    description:
      'Essential cybersecurity defense platforms protecting cloud workloads, zero-trust enterprise endpoints, and identity security against nation-state threats.',
    methodology:
      'Selected based on annual recurring revenue (ARR) retention > 115% and enterprise customer adoption.',
    riskScore: 6,
    allocations: [
      { symbol: 'CRWD', name: 'CrowdStrike Holdings', targetWeight: 30, currentPrice: 320.5, sector: 'Endpoint & Threat Intel' },
      { symbol: 'PANW', name: 'Palo Alto Networks', targetWeight: 25, currentPrice: 345.1, sector: 'Zero Trust Firewalls' },
      { symbol: 'FTNT', name: 'Fortinet Inc', targetWeight: 25, currentPrice: 76.2, sector: 'Secure Access & SASE' },
      { symbol: 'ZS', name: 'Zscaler Inc', targetWeight: 20, currentPrice: 188.7, sector: 'Cloud Security Gateways' },
    ],
    metrics: {
      oneMonthReturn: 3.1,
      oneYearReturn: 31.8,
      allTimeReturn: 74.2,
      sharpeRatio: 1.92,
      maxDrawdown: -11.5,
      volatility: 15.8,
      benchmark: 'S&P 500 (SPY)',
      alphaVsBenchmark: 8.6,
    },
    copiersCount: 970,
    totalMirroredCapital: 8940000,
    minInvestment: 800,
    lastRebalanced: new Date('2026-10-28'),
    status: 'ACTIVE',
    regulatoryFormADVUrl: 'https://adviserinfo.sec.gov/firm/summary/184000',
  },
];

export const mockSocialPosts = [
  {
    _id: 'post_001',
    author: mockUsers[0],
    portfolio: mockPortfolios[0],
    title: 'Q4 AI Infrastructure Rebalance: Why We Increased Taiwan Semi (TSM) Weight',
    content:
      'We recently updated our Generative AI & Compute model basket. Despite macro rate volatility, advanced packaging (CoWoS) lead times remain extended through mid-2027. We trimmed 4% from peripheral software to allocate deeper into upstream foundries (TSM) and optical interconnects (AVGO). See the updated allocation breakdown below.',
    themeTag: 'Artificial Intelligence & Cloud',
    sentiment: 'Bullish',
    likes: ['usr_retail_001'],
    comments: [
      {
        _id: 'comm_001',
        user: mockUsers[2],
        text: 'Great breakdown Sarah! How do you expect hyperscaler CAPEX guidance to impact TSM margins in early 2027?',
        createdAt: new Date('2026-11-18T14:32:00Z'),
      },
      {
        _id: 'comm_002',
        user: mockUsers[0],
        text: 'Hyperscaler commitments are locked via long-term supply agreements. High node utilization directly stabilizes gross margins above 53%.',
        createdAt: new Date('2026-11-18T15:10:00Z'),
      },
    ],
    complianceNotice:
      'Regulatory Compliance Disclaimer: Opinions expressed by registered advisors do not constitute personalized investment advice. Form ADV Part 2A available upon request.',
    createdAt: new Date('2026-11-18T10:00:00Z'),
  },
  {
    _id: 'post_002',
    author: mockUsers[1],
    portfolio: mockPortfolios[1],
    title: 'Nuclear Baseload Power and Data Center Demand Convergence',
    content:
      'The convergence of clean power mandates and continuous AI data center power draws is revitalizing nuclear operators like Constellation Energy (CEG). We discuss our long-term thematic thesis on baseload non-intermittent green energy.',
    themeTag: 'Clean Tech & Renewable Energy',
    sentiment: 'Bullish',
    likes: [],
    comments: [],
    complianceNotice:
      'Regulatory Compliance Disclaimer: Past performance does not guarantee future results. Investments are subject to market loss.',
    createdAt: new Date('2026-11-19T08:30:00Z'),
  },
];

export const mockCopyTrades = [
  {
    _id: 'copy_001',
    retailUser: mockUsers[2],
    portfolio: mockPortfolios[0],
    advisor: mockUsers[0],
    allocatedCapital: 5000,
    cashBufferPercent: 5,
    stopLossPercent: 15,
    autoRebalance: true,
    mirroredPositions: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', targetWeight: 28, allocatedDollars: 1330, estimatedShares: 10.35, executionPrice: 128.5 },
      { symbol: 'MSFT', name: 'Microsoft Corp', targetWeight: 22, allocatedDollars: 1045, estimatedShares: 2.45, executionPrice: 425.2 },
      { symbol: 'TSM', name: 'Taiwan Semiconductor', targetWeight: 18, allocatedDollars: 855, estimatedShares: 4.95, executionPrice: 172.4 },
      { symbol: 'AVGO', name: 'Broadcom Inc', targetWeight: 16, allocatedDollars: 760, estimatedShares: 4.61, executionPrice: 164.8 },
      { symbol: 'AMZN', name: 'Amazon.com Inc (AWS)', targetWeight: 16, allocatedDollars: 760, estimatedShares: 4.08, executionPrice: 186.1 },
    ],
    status: 'ACTIVE',
    unrealizedPnL: 342.5,
    suitabilityAcknowledged: true,
    createdAt: new Date('2026-11-05T09:00:00Z'),
  },
];

export const mockRegulatoryLogs = [
  {
    _id: 'reg_001',
    userId: 'usr_retail_001',
    action: 'SUITABILITY_TEST_PASSED',
    metadata: { riskTolerance: 'Moderate', maxLossTolerance: '15%', liquidNetWorth: '$50k-$100k' },
    regulatoryReference: 'FINRA Rule 2111 (Suitability)',
    timestamp: new Date('2026-11-05T08:50:00Z'),
  },
  {
    _id: 'reg_002',
    userId: 'usr_retail_001',
    action: 'DISCLOSURE_FORM_ADV_ACKNOWLEDGED',
    metadata: { advisorCrd: 'CRD-6894021', firmName: 'Apex Thematic Asset Management LLC' },
    regulatoryReference: 'SEC Rule 204-3 (Brochure Rule)',
    timestamp: new Date('2026-11-05T08:55:00Z'),
  },
  {
    _id: 'reg_003',
    userId: 'usr_retail_001',
    action: 'COPY_ALLOCATION_AUTHORIZED',
    metadata: { portfolioId: 'port_001', amount: 5000, cashBuffer: 5 },
    regulatoryReference: 'SEC Advisers Act Section 206',
    timestamp: new Date('2026-11-05T09:00:00Z'),
  },
];

export default {
  mockUsers,
  mockPortfolios,
  mockSocialPosts,
  mockCopyTrades,
  mockRegulatoryLogs,
};
