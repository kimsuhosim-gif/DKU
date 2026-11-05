/** Pre-rendered pixelfx sprites; attribution lives beside the PNGs. */
export type ImpactKind = 'hit-spark' | 'crit-hit' | 'shield-block';
export const IMPACTS = {
 'hit-spark': {width:136,height:80,columns:4,frames:16,pivot:[44,44],duration:.4,scale:1.25},
 'crit-hit': {width:216,height:136,columns:5,frames:28,pivot:[84,80],duration:.6,scale:1.4},
 'shield-block': {width:148,height:104,columns:5,frames:34,pivot:[40,58],duration:.5,scale:1.4},
} as const;
