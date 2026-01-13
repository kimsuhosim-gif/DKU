// Fix: Added missing React import to resolve the React namespace
import React from 'react';

export interface Member {
  id: string;
  name: string;
  role: string;
  handicap: number;
  prevHandicap?: number;
  averageScore: number;
  scoreHistory?: number[];
  phone?: string;
}

export interface RoundingSchedule {
  id: string;
  date: string;
  location: string;
  time: string;
  description: string;
  participants: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface QuickMenuItem {
  id: string;
  label: string;
  // Fix: Usage of React.ReactNode requires importing the React library
  icon: React.ReactNode;
  color: string;
}