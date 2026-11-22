'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: 'usr_retail_001',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'retail',
    riskProfile: 'Moderate',
    portfolioBalance: 32500,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isKYCCompleted: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to verify stored token if available
    const checkAuth = async () => {
      try {
        if (api.token) {
          const res = await api.getMe();
          if (res.user) setUser(res.user);
        }
      } catch (err) {
        console.log('Session check completed');
      }
    };
    checkAuth();
  }, []);

  const loginAsDemo = (roleType = 'retail') => {
    if (roleType === 'ria') {
      setUser({
        _id: 'usr_ria_001',
        name: 'Sarah Chen, CFA',
        email: 'sarah.chen@apexwealth.com',
        role: 'ria',
        riskProfile: 'Moderate',
        portfolioBalance: 850000,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        riaProfile: {
          crdNumber: 'CRD-6894021',
          firmName: 'Apex Thematic Asset Management LLC',
          isVerified: true,
          aum: 184000000,
          experienceYears: 14,
          bio: 'Former senior quantitative equity strategist at BlackRock. Specializes in disruptive AI infrastructure and compute fabrics.',
          accreditations: ['CFA', 'Series 65', 'Series 7'],
          followerCount: 14820,
          rating: 4.9,
        },
      });
    } else {
      setUser({
        _id: 'usr_retail_001',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        role: 'retail',
        riskProfile: 'Moderate',
        portfolioBalance: 32500,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        isKYCCompleted: true,
      });
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        isRIA: user?.role === 'ria',
        loginAsDemo,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
