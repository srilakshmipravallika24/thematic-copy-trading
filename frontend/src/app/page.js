'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import PortfolioCard from '../components/PortfolioCard';
import DiscussionFeed from '../components/DiscussionFeed';
import { api } from '../services/api';
import { mockPortfolios, mockSocialPosts } from '../utils/mockStore';
import {
  TrendingUp,
  ShieldCheck,
  Users,
  Layers,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const THEMES = [
  'All Themes',
  'Artificial Intelligence & Cloud',
  'Clean Tech & Renewable Energy',
  'Cybersecurity & Defense',
];

export default function HomePage() {
  const [portfolios, setPortfolios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('baskets'); // 'baskets' | 'forum'
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getPortfolios();
        if (res.portfolios) {
          setPortfolios(res.portfolios);
        } else {
          setPortfolios(mockPortfolios);
        }
      } catch (err) {
        setPortfolios(mockPortfolios);
      }

      try {
        const socialRes = await api.getSocialPosts();
        if (socialRes.posts) {
          setPosts(socialRes.posts);
        } else {
          setPosts(mockSocialPosts);
        }
      } catch (err) {
        setPosts(mockSocialPosts);
      }
    };

    loadData();
  }, []);

  const handleTradeSuccess = (newTrade) => {
    setNotification(`Mirror trade authorized for $${newTrade.allocatedCapital.toLocaleString()}!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePostCreated = async (payload) => {
    try {
      const res = await api.createSocialPost(payload);
      if (res.post) {
        setPosts((prev) => [res.post, ...prev]);
      }
    } catch (err) {
      const dummy = {
        _id: `post_${Date.now()}`,
        author: { name: 'You (Current User)', role: 'retail' },
        ...payload,
        createdAt: new Date(),
        likes: [],
        comments: [],
        complianceNotice:
          'Regulatory Compliance Disclaimer: Commentary provided is strictly educational.',
      };
      setPosts((prev) => [dummy, ...prev]);
    }
  };

  const handleCommentAdded = async (postId, text) => {
    try {
      const res = await api.addComment(postId, text);
      if (res.post) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? res.post : p)));
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), { user: { name: 'You' }, text, createdAt: new Date() }],
            };
          }
          return p;
        })
      );
    }
  };

  const handleLikeToggled = async (postId) => {
    try {
      await api.toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const hasLiked = p.likes?.includes('usr_retail_001');
            const newLikes = hasLiked
              ? p.likes.filter((id) => id !== 'usr_retail_001')
              : [...(p.likes || []), 'usr_retail_001'];
            return { ...p, likes: newLikes };
          }
          return p;
        })
      );
    } catch (err) {
      // optimistic toggle
    }
  };

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesTheme = selectedTheme === 'All Themes' || p.theme === selectedTheme;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Regulated Fiduciary Network
              </span>
              <span className="text-xs text-slate-400 font-mono">Next.js • Express.js • MongoDB</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Institutional Social <span className="text-emerald-400">Copy-Trading</span> Network
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Empowering retail investors to follow, discuss, and mirror verified trade allocations
              curated by Registered Investment Advisors (RIAs). Fully compliant with the SEC Investment Advisers Act
              and FINRA Rule 2210.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('baskets')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Explore Model Baskets</span>
              </button>
              <a
                href="/advisors"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Directory of Verified RIAs</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 shrink-0 w-full md:w-80 shadow-inner">
            <div className="font-semibold text-slate-200 flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Platform Status
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Live Node v1.0</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Adviser Verification</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> SEC CRD Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mirror Engine</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Fractional Allocation
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cash Reserve Buffer</span>
                <span className="text-white font-semibold">2% - 10% Dynamic</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Compliance Audit</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Form ADV Logged
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-2xl text-sm flex items-center justify-between animate-fadeIn">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Network Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Verified Advisor AUM"
          value="$276.4M"
          subtext="SEC CRD registered firms"
          icon={ShieldCheck}
          trend="+18.4%"
        />
        <MetricCard
          title="Mirrored Retail Capital"
          value="$28.2M"
          subtext="Allocated across 3,230 copiers"
          icon={TrendingUp}
          trend="+34.2%"
        />
        <MetricCard
          title="Thematic Model Baskets"
          value="14 Baskets"
          subtext="AI, Clean Tech, Defense, Bio"
          icon={Layers}
        />
        <MetricCard
          title="Regulatory Audit Score"
          value="100%"
          subtext="Zero disciplinary actions"
          icon={Users}
          trend="Audited"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('baskets')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'baskets'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Thematic Model Baskets ({filteredPortfolios.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'forum'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Advisory Discussion Feed</span>
          </button>
        </div>

        {activeTab === 'baskets' && (
          <div className="hidden md:flex items-center gap-2 relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search thematic portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'baskets' ? (
        <div className="space-y-6">
          {/* Theme Filters */}
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition border ${
                  selectedTheme === theme
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* Portfolios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio._id}
                portfolio={portfolio}
                onTradeSuccess={handleTradeSuccess}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <DiscussionFeed
            posts={posts}
            onPostCreated={handlePostCreated}
            onCommentAdded={handleCommentAdded}
            onLikeToggled={handleLikeToggled}
          />
        </div>
      )}
    </div>
  );
}
