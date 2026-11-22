'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Heart, ShieldCheck, Send, AlertCircle } from 'lucide-react';

export default function DiscussionFeed({ posts = [], onPostCreated, onCommentAdded, onLikeToggled }) {
  const { user, isRIA } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Artificial Intelligence & Cloud');
  const [newSentiment, setNewSentiment] = useState('Bullish');
  const [commentInputs, setCommentInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (onPostCreated) {
      onPostCreated({
        title: newTitle,
        content: newContent,
        themeTag: newTag,
        sentiment: newSentiment,
      });
    }

    setNewTitle('');
    setNewContent('');
  };

  const handleCommentSubmit = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    if (onCommentAdded) {
      onCommentAdded(postId, text);
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Create Discussion Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base">
            {isRIA ? 'Publish RIA Advisory Thesis & Market Commentary' : 'Join Thematic Investment Discussion'}
          </h3>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Topic or Thesis (e.g. Q4 Hyperscaler CAPEX & Semiconductor Margins)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Share analysis, fundamental reasoning, or ask questions to verified advisors..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="Artificial Intelligence & Cloud">Artificial Intelligence & Cloud</option>
                <option value="Clean Tech & Renewable Energy">Clean Tech & Renewable Energy</option>
                <option value="Semiconductor & Hardware">Semiconductor & Hardware</option>
                <option value="Cybersecurity & Defense">Cybersecurity & Defense</option>
              </select>

              <select
                value={newSentiment}
                onChange={(e) => setNewSentiment(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="Bullish">Bullish 📈</option>
                <option value="Neutral">Neutral ⚖️</option>
                <option value="Bearish">Bearish 📉</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post to Network</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            Mandatory SEC Rule 2210 and FINRA advertising disclaimers are automatically appended to all posts.
          </p>
        </form>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                  alt={post.author?.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                    <span>{post.author?.name}</span>
                    {post.author?.role === 'ria' && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified RIA
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {post.author?.riaProfile?.firmName || 'Community Member'} • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                  {post.themeTag}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    post.sentiment === 'Bullish'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {post.sentiment}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div>
              <h4 className="font-bold text-lg text-white mb-2">{post.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Compliance notice */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-[10px] text-slate-500 italic">
              {post.complianceNotice}
            </div>

            {/* Interaction Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikeToggled && onLikeToggled(post._id)}
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                >
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <span>{post.likes?.length || 0} Likes</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{post.comments?.length || 0} Comments</span>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Discussion Thread
                </div>
                {post.comments.map((comm, idx) => (
                  <div key={idx} className="text-xs space-y-1 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{comm.user?.name || 'Investor'}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-400">{comm.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a compliant reply..."
                value={commentInputs[post._id] || ''}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommentSubmit(post._id);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleCommentSubmit(post._id)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
