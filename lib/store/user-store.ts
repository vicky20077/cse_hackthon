'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserStats } from '@/types/user';
import { DEMO_USER, DEMO_STATS } from './mock-data';

const USER_STORAGE_KEY = 'interviewai_user_profile';
const STATS_STORAGE_KEY = 'interviewai_user_stats';
const AUTH_STORAGE_KEY = 'interviewai_auth_session';

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return DEMO_USER;
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEMO_USER;
}

export function saveStoredUser(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

export function getStoredStats(): UserStats {
  if (typeof window === 'undefined') return DEMO_STATS;
  try {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEMO_STATS;
}

export function saveStoredStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    return auth === 'true' || auth === null; // default to true in demo mode
  } catch {
    return true;
  }
}

export function setUserAuthenticated(status: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, status ? 'true' : 'false');
  } catch {}
}
