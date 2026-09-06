'use client';

import { InterviewSession } from '@/types/interview';
import { DEMO_INTERVIEW_HISTORY } from './mock-data';

const SESSIONS_STORAGE_KEY = 'interviewai_interview_sessions';
const ACTIVE_SESSION_KEY = 'interviewai_active_session';

export function getStoredSessions(): InterviewSession[] {
  if (typeof window === 'undefined') return DEMO_INTERVIEW_HISTORY;
  try {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEMO_INTERVIEW_HISTORY;
}

export function saveSession(session: InterviewSession) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredSessions();
    const existingIndex = current.findIndex((s) => s.id === session.id);
    let updated: InterviewSession[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = session;
    } else {
      updated = [session, ...current];
    }
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function getSessionById(id: string): InterviewSession | null {
  const sessions = getStoredSessions();
  return sessions.find((s) => s.id === id) || null;
}

export function getActiveSession(): InterviewSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function clearActiveSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {}
}
