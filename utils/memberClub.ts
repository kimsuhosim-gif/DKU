import { getProcessRankings, records } from './golfData';

export const golfers = getProcessRankings();
export type Golfer = (typeof golfers)[number];
export const bestScore = (member: Golfer) => member.scoreHistory.length ? Math.min(...member.scoreHistory) : null;
export function badgesFor(member: Golfer) {
  const badges: string[] = [];
  if (member.roundCount && member.grossRankValue === golfers[0].grossRankValue) badges.push('평균 타수 1위');
  if (member.roundCount && member.roundCount === Math.max(...golfers.map(m => m.roundCount))) badges.push('최다 출전');
  if (member.scoreHistory.length > 1 && member.scoreHistory[0] === bestScore(member)) badges.push('최근 개인 최고');
  return badges;
}
export function headToHead(a: string, b: string) {
  return records.flatMap(record => {
    const left = record.attendees.find(p => p.name === a);
    const right = record.attendees.find(p => p.name === b);
    return left && right ? [{ date: record.date, location: record.location, left: left.score, right: right.score }] : [];
  });
}
export function drawGroups(names: string[], random = Math.random) {
  const shuffled = [...new Set(names)];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Four per group where possible; distribute leftovers to avoid a solo group.
  const count = Math.ceil(shuffled.length / 4);
  return Array.from({ length: count }, (_, i) => shuffled.filter((_, index) => index % count === i));
}
