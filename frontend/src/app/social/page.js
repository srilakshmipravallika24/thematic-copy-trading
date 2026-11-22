'use client';

import React, { useState, useEffect } from 'react';
import DiscussionFeed from '../../components/DiscussionFeed';
import { api } from '../../services/api';
import { mockSocialPosts } from '../../utils/mockStore';
import { MessageSquare, ShieldCheck } from 'lucide-react';

export default function SocialPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.getSocialPosts();
        if (res.posts) setPosts(res.posts);
        else setPosts(mockSocialPosts);
      } catch (err) {
        setPosts(mockSocialPosts);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = async (payload) => {
    try {
      const res = await api.createSocialPost(payload);
      if (res.post) setPosts((prev) => [res.post, ...prev]);
    } catch (err) {
      const dummy = {
        _id: `post_${Date.now()}`,
        author: { name: 'You (Current User)', role: 'retail' },
        ...payload,
        createdAt: new Date(),
        likes: [],
        comments: [],
        complianceNotice:
          'Regulatory Compliance Disclaimer: Content is educational and not personalized advice.',
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
    } catch (err) {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Fiduciary Community Feed</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Advisory & Thematic Discussion Forum</h1>
        <p className="text-sm text-slate-400 mt-1">
          Engage directly with verified Registered Investment Advisors. All investment theses, rebalance rationales, and community discussions are moderated in accordance with SEC Rule 2210.
        </p>
      </div>

      <DiscussionFeed
        posts={posts}
        onPostCreated={handlePostCreated}
        onCommentAdded={handleCommentAdded}
        onLikeToggled={handleLikeToggled}
      />
    </div>
  );
}
