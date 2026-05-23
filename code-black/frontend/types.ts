export interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export type RiskTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'UNKNOWN';
