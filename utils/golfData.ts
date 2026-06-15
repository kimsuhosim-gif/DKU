export interface MemberData {
  name: string;
  role: string;
  phone?: string;
  since: string;
  prevHandicap: number;
  scoreHistory: number[];
  holeScores?: number[][];
  latestParData?: number[];
  peoriaHandicap?: number;
  peoriaNet?: number;
  img: string;
}

const SIENNA_PAR_DATA = [4, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 4, 4, 3, 5, 3, 4];
export const PAR_DATA = [4, 4, 4, 4, 3, 4, 5, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5];

export const members: MemberData[] = [
  {
    name: '정재엽',
    role: '정회원',
    prevHandicap: 18.0,
    scoreHistory: [92, 90],
    holeScores: [
      [6, 5, 7, 6, 3, 5, 5, 4, 6, 6, 6, 3, 5, 5, 4, 4, 5, 7],
      [4, 6, 4, 3, 6, 4, 5, 6, 6, 5, 5, 6, 5, 5, 4, 6, 4, 5],
    ],
    peoriaHandicap: 18.0,
    peoriaNet: 74.0,
    img: '/images/profiles/members_정재엽.jpg',
    since: '2023.01',
    phone: '01026219101',
  },
  {
    name: '모성진',
    role: '정회원',
    prevHandicap: 21.0,
    scoreHistory: [87, 93],
    holeScores: [
      [5, 7, 7, 5, 3, 4, 5, 3, 5, 5, 7, 3, 6, 5, 4, 3, 5, 5],
      [6, 5, 6, 3, 6, 4, 3, 5, 7, 5, 6, 5, 6, 7, 4, 7, 4, 4],
    ],
    peoriaHandicap: 12.0,
    peoriaNet: 75.0,
    img: '/images/profiles/members_모성진.png',
    since: '2023.01',
    phone: '01047682858',
  },
  {
    name: '유만종',
    role: '회장',
    prevHandicap: 19.5,
    scoreHistory: [99, 94],
    holeScores: [
      [5, 7, 6, 6, 4, 4, 5, 4, 7, 5, 7, 4, 7, 7, 5, 4, 5, 7],
      [6, 8, 7, 3, 4, 5, 3, 6, 5, 6, 7, 5, 6, 6, 4, 5, 3, 5],
    ],
    peoriaHandicap: 21.6,
    peoriaNet: 77.4,
    img: '/images/profiles/members_유만종.jpg',
    since: '2023.01',
    phone: '01031999922',
  },
  {
    name: '김영웅',
    role: '정회원',
    prevHandicap: 22.0,
    scoreHistory: [98, 95],
    holeScores: [
      [8, 4, 6, 7, 3, 4, 6, 4, 7, 6, 6, 5, 6, 6, 3, 6, 5, 6],
      [4, 6, 5, 4, 5, 5, 4, 5, 6, 6, 8, 7, 5, 7, 4, 7, 2, 5],
    ],
    peoriaHandicap: 19.2,
    peoriaNet: 78.8,
    img: '/images/profiles/members_김영웅.jpg',
    since: '2023.01',
    phone: '01028104255',
  },
  {
    name: '신연성',
    role: '정회원',
    prevHandicap: 23.5,
    scoreHistory: [93, 97],
    holeScores: [
      [6, 6, 6, 6, 3, 4, 6, 3, 6, 4, 7, 4, 6, 5, 7, 4, 6, 4],
      [7, 6, 6, 3, 5, 5, 4, 5, 5, 4, 6, 6, 7, 7, 5, 7, 3, 6],
    ],
    peoriaHandicap: 15.6,
    peoriaNet: 77.4,
    img: '/images/profiles/members_신연성.jpg',
    since: '2023.01',
    phone: '01026966518',
  },
  {
    name: '양창운',
    role: '총무',
    prevHandicap: 18.5,
    scoreHistory: [109, 101],
    holeScores: [
      [8, 5, 5, 5, 5, 7, 9, 5, 7, 5, 5, 3, 9, 6, 7, 4, 8, 6],
      [5, 8, 6, 4, 4, 7, 3, 7, 7, 5, 5, 7, 5, 6, 4, 8, 5, 5],
    ],
    peoriaHandicap: 28.8,
    peoriaNet: 80.2,
    img: '/images/profiles/members_양창운.jpg',
    since: '2023.01',
    phone: '01085426586',
  },
  {
    name: '김효민',
    role: '정회원',
    prevHandicap: 24.0,
    scoreHistory: [109, 102],
    holeScores: [
      [6, 7, 7, 6, 4, 5, 6, 5, 7, 7, 5, 5, 5, 8, 7, 6, 6, 7],
      [4, 6, 8, 4, 7, 5, 4, 5, 6, 4, 7, 7, 8, 7, 4, 8, 3, 5],
    ],
    peoriaHandicap: 34.8,
    peoriaNet: 74.2,
    img: '/images/profiles/members_김효민.jpg',
    since: '2023.01',
    phone: '01093014798',
  },
  {
    name: '최재호',
    role: '정회원',
    prevHandicap: 28.5,
    scoreHistory: [112],
    holeScores: [[7, 8, 7, 3, 4, 7, 5, 8, 5, 7, 6, 7, 6, 8, 6, 8, 3, 7]],
    latestParData: SIENNA_PAR_DATA,
    img: '/images/profiles/members_최재호.jpg',
    since: '2023.01',
    phone: '01022698528',
  },
  {
    name: '홍지훈',
    role: '정회원',
    prevHandicap: 32.0,
    scoreHistory: [124],
    holeScores: [[7, 9, 7, 6, 6, 6, 5, 10, 7, 6, 7, 8, 6, 8, 5, 10, 4, 7]],
    latestParData: SIENNA_PAR_DATA,
    img: '/images/profiles/members_홍지훈.jpg',
    since: '2023.01',
    phone: '01041520738',
  },
  {
    name: '김성태',
    role: '정회원',
    prevHandicap: 31.5,
    scoreHistory: [104, 126],
    holeScores: [
      [7, 6, 6, 7, 4, 7, 8, 4, 5, 7, 7, 4, 6, 6, 6, 5, 5, 4],
      [6, 10, 6, 6, 7, 7, 5, 6, 8, 7, 8, 8, 8, 7, 6, 9, 5, 7],
    ],
    peoriaHandicap: 22.8,
    peoriaNet: 81.2,
    img: '/images/profiles/members_김성태.jpg',
    since: '2023.01',
    phone: '01049029220',
  },
  {
    name: '김성진',
    role: '정회원',
    prevHandicap: 33.0,
    scoreHistory: [120, 127],
    holeScores: [
      [7, 7, 7, 6, 6, 6, 8, 4, 8, 6, 7, 6, 8, 7, 7, 6, 7, 7],
      [7, 8, 8, 6, 8, 8, 4, 9, 7, 7, 8, 8, 8, 8, 5, 7, 4, 7],
    ],
    peoriaHandicap: 37.2,
    peoriaNet: 82.8,
    img: '/images/profiles/members_김성진.jpg',
    since: '2023.01',
    phone: '01020840638',
  },
  {
    name: '김도윤',
    role: '정회원',
    prevHandicap: 37.0,
    scoreHistory: [125, 132],
    holeScores: [
      [8, 8, 8, 8, 4, 7, 8, 5, 9, 8, 5, 6, 6, 8, 6, 6, 7, 8],
      [8, 9, 8, 6, 8, 7, 5, 8, 8, 7, 8, 8, 8, 6, 6, 9, 5, 8],
    ],
    peoriaHandicap: 48.0,
    peoriaNet: 77.0,
    img: '/images/profiles/members_김도윤.jpg',
    since: '2023.01',
    phone: '01089463040',
  },
  {
    name: '김경준',
    role: '정회원',
    prevHandicap: 18.0,
    scoreHistory: [],
    img: '/images/profiles/members_김경준.jpg',
    since: '2023.01',
    phone: '01040261184',
  },
  {
    name: '김준영',
    role: '정회원',
    prevHandicap: 18.0,
    scoreHistory: [],
    img: '/images/profiles/members_김준영.jpg',
    since: '2023.01',
    phone: '01026342572',
  },
  {
    name: '홍장표',
    role: '정회원',
    prevHandicap: 18.0,
    scoreHistory: [],
    img: '/images/profiles/members_홍장표.jpg',
    since: '2023.01',
    phone: '01071659043',
  },
  {
    name: '이상우',
    role: '정회원',
    prevHandicap: 18.0,
    scoreHistory: [99],
    holeScores: [[8, 6, 6, 5, 3, 4, 7, 3, 8, 5, 4, 5, 6, 7, 5, 4, 7, 6]],
    peoriaHandicap: 26.4,
    peoriaNet: 72.6,
    img: '/images/profiles/members_이상우.svg',
    since: '2026.04',
    phone: '01087862324',
  },
];

export interface MemberPersona {
  title: string;
  line: string;
  tags: string[];
  watchPoint: string;
}

export const memberPersonas: Record<string, MemberPersona> = {
  정재엽: {
    title: '초대 챔피언',
    line: '조용히 치는 척하다가 스코어카드로 말하는 타입.',
    tags: ['Gross 기준점', '첫 우승자'],
    watchPoint: '이번에도 90대 초반을 지키면 판이 다시 정리됩니다.',
  },
  모성진: {
    title: 'Net 경계령',
    line: '핸디가 반영되는 순간 존재감이 커지는 실속파.',
    tags: ['Net 리더', '꾸준함'],
    watchPoint: 'Net 1위 방어 여부가 이번 라운드 핵심 관전 포인트입니다.',
  },
  유만종: {
    title: '회장님 버프',
    line: '분위기를 살리고 동반조 텐션까지 같이 끌고 가는 중심축.',
    tags: ['회장', '동반조 텐션'],
    watchPoint: '회장님이 전반을 버티면 1팀 분위기가 바로 살아납니다.',
  },
  양창운: {
    title: '총무 겸 정산관',
    line: '계좌도 정리하고 스코어도 정리하려는 운영형 골퍼.',
    tags: ['총무', '계산 정확'],
    watchPoint: '회장과 같은 조에서 정산과 타수 모두 방어할 수 있을지가 포인트입니다.',
  },
  이상우: {
    title: '신입 변수',
    line: '데이터가 적어서 더 무서운 신규 전력.',
    tags: ['신규 전력', '미지수'],
    watchPoint: '첫 데이터가 쌓이는 순간 다음 조편성의 난이도가 바뀝니다.',
  },
  김영웅: {
    title: '한방 주인공',
    line: '이름값처럼 한 홀만 터져도 단톡방 톤이 달라지는 타입.',
    tags: ['스킨스 요주의', '버디 기대'],
    watchPoint: '3팀에서 한방이 나오면 마지막 조 분위기가 바로 바뀝니다.',
  },
  신연성: {
    title: '조용한 변수',
    line: '크게 티 내지 않다가 Net 계산에서 슬쩍 올라오는 스타일.',
    tags: ['후반 변수', 'Net 후보'],
    watchPoint: '1팀에서 이상우와 같이 흐름을 타면 첫 티업 분위기가 살아납니다.',
  },
  김성태: {
    title: '멘탈 체력전',
    line: '후반까지 버티면 갑자기 계산표가 재미있어지는 장기전형.',
    tags: ['후반 생존', '1팀 변수'],
    watchPoint: '1팀의 실제 승부는 김성태의 후반 버티기에서 갈릴 수 있습니다.',
  },
  김효민: {
    title: '효율 골퍼',
    line: '화려하진 않아도 계산해보면 은근히 손해를 안 보는 타입.',
    tags: ['안정형', 'Net 복병'],
    watchPoint: '1팀에서 신연성과 같이 조용히 Net을 깎을 수 있습니다.',
  },
  김도윤: {
    title: '업사이드 큰손',
    line: '핸디 폭이 커서 한 번만 정리되면 순위표를 흔드는 멤버.',
    tags: ['반등 후보', '큰손 핸디'],
    watchPoint: '3팀의 Net 판세는 김도윤이 얼마나 줄이느냐에 달려 있습니다.',
  },
  김성진: {
    title: '청모 버프 보유',
    line: '점심 일정까지 걸려 있어 이번 라운드 존재감이 큰 멤버.',
    tags: ['청모 버프', '1팀 변수'],
    watchPoint: '1팀에서 라운드와 점심 분위기를 동시에 책임지는 날입니다.',
  },
  최재호: {
    title: '후반 반등 예약',
    line: '전반보다 후반에 이야깃거리가 생기기 쉬운 타입.',
    tags: ['반등 대기', '멘탈전'],
    watchPoint: '다음 참석 때 이전 기록 대비 개선상 후보입니다.',
  },
  홍지훈: {
    title: '대형 드라마형',
    line: '한 라운드 안에서 기승전결이 제일 잘 나오는 캐릭터.',
    tags: ['드라마', '반전 후보'],
    watchPoint: '복귀 라운드에서는 분발상과 개선상을 동시에 노릴 수 있습니다.',
  },
  김경준: {
    title: '비공개 전력',
    line: '아직 기록이 적어 조편성 회의에서 해석이 갈리는 카드.',
    tags: ['미측정', '잠재 전력'],
    watchPoint: '첫 공식 기록이 생기면 핸디 판이 다시 잡힙니다.',
  },
  김준영: {
    title: '잠재 전력',
    line: '기록이 비어 있어 들어오는 순간 판을 새로 짜야 하는 멤버.',
    tags: ['미측정', '복귀 변수'],
    watchPoint: '첫 참석 때 어느 조에 들어가도 관전 포인트가 됩니다.',
  },
  홍장표: {
    title: '복귀 변수',
    line: '데이터보다 현장 컨디션이 먼저 궁금해지는 멤버.',
    tags: ['미측정', '현장형'],
    watchPoint: '기록이 쌓이면 라이벌 매칭 후보가 바로 생깁니다.',
  },
};

export interface MemberRivalry {
  id: string;
  title: string;
  players: [string, string];
  hook: string;
  stake: string;
}

export const memberRivalries: MemberRivalry[] = [
  {
    id: 'champion-net-leader',
    title: '챔피언 방어전',
    players: ['정재엽', '모성진'],
    hook: 'Gross 초대 챔피언과 Net 리더의 기준점 싸움.',
    stake: '정재엽이 총타수로 누르느냐, 모성진이 Net으로 뒤집느냐.',
  },
  {
    id: 'president-treasurer',
    title: '운영진 더비',
    players: ['유만종', '양창운'],
    hook: '회장과 총무가 같은 조. 분위기와 정산이 동시에 걸린 매치.',
    stake: '1팀은 이 둘의 전반 흐름에 따라 조 분위기가 바로 갈립니다.',
  },
  {
    id: 'hero-efficiency',
    title: '영웅효민 매치',
    players: ['김영웅', '김효민'],
    hook: '한방형 김영웅과 안정형 김효민의 스타일 충돌.',
    stake: '스킨스는 김영웅, Net 계산은 김효민 쪽으로 기울 수 있습니다.',
  },
  {
    id: 'sungtae-sungjin',
    title: '성태성진 후반전',
    players: ['김성태', '김성진'],
    hook: '후반으로 갈수록 이야깃거리가 생기는 고핸디 구간.',
    stake: '한 명만 후반을 줄여도 Net 순위표가 크게 움직입니다.',
  },
];

export const calculateAdjustedGross = (holeScores: number[], currentHandicap: number, parData = PAR_DATA) => {
  if (!holeScores || holeScores.length !== 18) return 0;

  let adjustedGross = 0;
  const baseStrokes = Math.floor(currentHandicap / 18);
  const remainder = Math.floor(currentHandicap % 18);

  holeScores.forEach((score, idx) => {
    const strokesReceived = baseStrokes + (idx < remainder ? 1 : 0);
    const maxScore = parData[idx] + 2 + strokesReceived;
    adjustedGross += Math.min(score, maxScore);
  });

  return adjustedGross;
};

export const calculateWHSIndex = (history: { gross: number; adjusted: number }[]) => {
  if (history.length === 0) return 0;

  const differentials = history.map((h) => h.adjusted - 72);
  const count = differentials.length;

  let bestN = 0;
  if (count <= 3) bestN = 1;
  else if (count <= 5) bestN = 1;
  else if (count <= 8) bestN = 2;
  else if (count <= 11) bestN = 3;
  else if (count <= 14) bestN = 4;
  else if (count <= 16) bestN = 5;
  else if (count <= 18) bestN = 6;
  else bestN = 8;

  const sortedDiffs = [...differentials].sort((a, b) => a - b);
  const bestDiffs = sortedDiffs.slice(0, bestN);
  const avgDiff = bestDiffs.reduce((a, b) => a + b, 0) / bestN;

  return parseFloat((avgDiff * 0.96).toFixed(1));
};

export const getProcessRankings = () => {
  const latestAttendees = records[0]?.attendees ?? [];
  const latestParticipantNames = new Set(latestAttendees.map((attendee) => attendee.name));

  return members
    .map((m) => {
      let latestAdjusted = 0;
      const playedLatestRound = latestParticipantNames.size === 0 || latestParticipantNames.has(m.name);

      if (m.holeScores && m.holeScores.length > 0) {
        latestAdjusted = calculateAdjustedGross(m.holeScores[0], m.prevHandicap, m.latestParData);
      }

      const historyObjects = m.scoreHistory.map((gross, i) => {
        const adj = i === 0 && latestAdjusted > 0 ? latestAdjusted : gross;
        return { gross, adjusted: adj };
      });

      const newHandicap = calculateWHSIndex(historyObjects);
      const latestGross = playedLatestRound && m.scoreHistory.length > 0 ? m.scoreHistory[0] : 0;
      const rankingHandicap = m.peoriaHandicap ?? newHandicap;
      const rankingNet = m.peoriaNet ?? (latestGross > 0 ? latestGross - rankingHandicap : 999);
      const net = latestGross > 0 ? parseFloat(rankingNet.toFixed(1)) : 999;
      const roundCount = m.scoreHistory.length;
      const grossAverage =
        roundCount > 0 ? m.scoreHistory.reduce((sum, score) => sum + score, 0) / roundCount : 999;
      const grossAverageDisplay = roundCount > 0 ? grossAverage.toFixed(1) : '-';
      const lastRecordedScore = roundCount > 0 ? m.scoreHistory[0] : '-';

      return {
        ...m,
        whsHandicap: newHandicap,
        handicap: rankingHandicap,
        latestScore: latestGross === 0 ? '-' : latestGross,
        lastRecordedScore,
        roundCount,
        grossAverageDisplay,
        latestAdjusted: latestAdjusted === 0 ? '-' : latestAdjusted,
        netScoreDisplay: latestGross > 0 ? rankingNet.toFixed(1) : '-',
        netScoreValue: net,
        grossRankValue: grossAverage,
        improved: m.scoreHistory.length > 1 && latestGross < m.scoreHistory[1],
      };
    })
    .sort((a, b) => {
      const latestA = typeof a.lastRecordedScore === 'number' ? a.lastRecordedScore : 999;
      const latestB = typeof b.lastRecordedScore === 'number' ? b.lastRecordedScore : 999;
      return a.grossRankValue - b.grossRankValue || b.roundCount - a.roundCount || latestA - latestB || a.name.localeCompare(b.name, 'ko');
    });
};

export interface RoundingRecord {
  date: string;
  location: string;
  winner: string;
  score: number;
  attendees: { name: string; score: number; front: number; back: number }[];
}

export const records: RoundingRecord[] = [
  {
    date: '2026.06.13',
    location: '코브스윙CC (구 참밸리)',
    winner: '모성진',
    score: 87,
    attendees: [
      { name: '모성진', score: 87, front: 44, back: 43 },
      { name: '정재엽', score: 92, front: 47, back: 45 },
      { name: '신연성', score: 93, front: 46, back: 47 },
      { name: '김영웅', score: 98, front: 49, back: 49 },
      { name: '이상우', score: 99, front: 50, back: 49 },
      { name: '유만종', score: 99, front: 48, back: 51 },
      { name: '김성태', score: 104, front: 54, back: 50 },
      { name: '양창운', score: 109, front: 56, back: 53 },
      { name: '김효민', score: 109, front: 53, back: 56 },
      { name: '박준석(게스트)', score: 112, front: 58, back: 54 },
      { name: '김성진', score: 120, front: 59, back: 61 },
      { name: '김도윤', score: 125, front: 65, back: 60 },
    ],
  },
  {
    date: '2025.11.29',
    location: '더 시에나 벨루토 CC (여주)',
    winner: '정재엽',
    score: 90,
    attendees: [
      { name: '정재엽', score: 90, front: 45, back: 45 },
      { name: '모성진', score: 93, front: 45, back: 48 },
      { name: '유만종', score: 94, front: 47, back: 47 },
      { name: '김영웅', score: 95, front: 44, back: 51 },
      { name: '신연성', score: 97, front: 46, back: 51 },
      { name: '양창운', score: 101, front: 51, back: 50 },
      { name: '김효민', score: 102, front: 49, back: 53 },
      { name: '최재호', score: 112, front: 54, back: 58 },
      { name: '홍지훈', score: 124, front: 63, back: 61 },
      { name: '김성태', score: 126, front: 61, back: 65 },
      { name: '김성진', score: 127, front: 65, back: 62 },
      { name: '김도윤', score: 132, front: 67, back: 65 },
    ],
  },
];

export const COURSE_LOCATIONS: Record<string, { lat: number; lng: number; address: string; img: string }> = {
  '코브스윙CC (구 참밸리)': {
    lat: 37.867211,
    lng: 127.136406,
    address: '코브스윙CC 클럽하우스 좌표 기준',
    img: '/images/round2/round2-01.jpg',
  },
  '더 시에나 벨루토 CC (여주)': {
    lat: 37.227445,
    lng: 127.618625,
    address: '경기 여주시 북내면 가정리 산3-1',
    img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400',
  },
};

export interface PhotoItem {
  id: string;
  src: string;
  date: string;
  location: string;
  bestScore: number | string;
  participants: number;
  category: '2026' | '2025' | 'Memories';
}

const round2GalleryPhotos: PhotoItem[] = Array.from({ length: 16 }, (_, index) => {
  const photoNumber = String(index + 1).padStart(2, '0');
  return {
    id: `round2-${photoNumber}`,
    src: `/images/round2/round2-${photoNumber}.jpg`,
    date: '2026.06.13',
    location: '코브스윙CC (구 참밸리)',
    bestScore: 87,
    participants: 12,
    category: '2026' as const,
  };
});

export const galleryPhotos: PhotoItem[] = [
  ...round2GalleryPhotos,
  {
    id: 'new-1',
    src: '/images/round1_group.jpg',
    date: '2025.11.29',
    location: 'The Sienna Velluto CC',
    bestScore: 90,
    participants: 12,
    category: '2025',
  },
];

export interface ClubEvent {
  id: string;
  type: '경조사' | '모임' | '공지';
  emoji: string;
  title: string;
  date: string;
  venue?: string;
  description: string;
}

export const clubEvents: ClubEvent[] = [
  {
    id: 'kim-sungjin-wedding-20260704',
    type: '경조사',
    emoji: '💍',
    title: '김성진 결혼식',
    date: '2026.07.04 (토) 12:30',
    venue: '더채플앳청담',
    description: '김성진 동기의 결혼을 축하합니다. 동기들의 따뜻한 마음을 함께 전하는 자리입니다.',
  },
];

export const ACCOUNT_NUMBER = '3333-16-4428815';
export const ACCOUNT_HOLDER = '양창운';

export const clubFinanceSummary = {
  perMemberDues: 120000,
  newMemberFee: 50000,
  memberCount: 16,
  newMemberCount: 4,
  carriedBalance2025: 510500,
  duesBudget2026: 2120000,
  totalBudget2026: 2630500,
  expectedFirstHalfExpense2026: 700000,
  expectedSecondHalfExpense2026: 1100000,
  paidAmount2026: 1370000,
  unpaidAmount2026: 750000,
  currentCash: 1880500,
};

export interface MembershipDueRow {
  no: number;
  name: string;
  type: '기존' | '신규';
  annualDues: number;
  entranceFee: number;
  billedAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  note?: string;
}

export const membershipDues2026: MembershipDueRow[] = [
  { no: 1, name: '모성진', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 2, name: '정재엽', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 3, name: '유만종', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 4, name: '홍지훈', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 0, unpaidAmount: 120000, note: '26년 상반기 모임 불참' },
  { no: 5, name: '김효민', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 6, name: '김영웅', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 7, name: '신연성', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 8, name: '양창운', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 9, name: '최재호', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 0, unpaidAmount: 120000, note: '26년 상반기 모임 불참' },
  { no: 10, name: '김도윤', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 11, name: '김성태', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 12, name: '김성진', type: '기존', annualDues: 120000, entranceFee: 0, billedAmount: 120000, paidAmount: 120000, unpaidAmount: 0 },
  { no: 13, name: '이상우', type: '신규', annualDues: 120000, entranceFee: 50000, billedAmount: 170000, paidAmount: 170000, unpaidAmount: 0 },
  { no: 14, name: '홍장표', type: '신규', annualDues: 120000, entranceFee: 50000, billedAmount: 170000, paidAmount: 0, unpaidAmount: 170000, note: '26년 상반기 모임 불참' },
  { no: 15, name: '김경준', type: '신규', annualDues: 120000, entranceFee: 50000, billedAmount: 170000, paidAmount: 0, unpaidAmount: 170000, note: '26년 상반기 모임 불참' },
  { no: 16, name: '김준영', type: '신규', annualDues: 120000, entranceFee: 50000, billedAmount: 170000, paidAmount: 0, unpaidAmount: 170000, note: '26년 상반기 모임 불참' },
];

export interface NextSchedule {
  title: string;
  date: string;
  location: string;
  note: string;
}

export const nextSchedule: NextSchedule = {
  title: '2회 정기 라운딩 결과',
  date: '2026.06.13 (토) · 06:14 티오프',
  location: '코브스윙CC (구 참밸리)',
  note: '모성진 87타 우승 · 정재엽 92타 · 신연성 93타 · 12명 참가.',
};

export interface HallOfFameItem {
  label: string;
  name: string;
  value: string;
}

export const hallOfFame: HallOfFameItem[] = [
  { label: '2회 우승', name: '모성진', value: '87타' },
  { label: '신페리오 우승', name: '박준석', value: '72.4' },
  { label: '최다 참가', name: '12명', value: '2회 라운드' },
];

export interface RoundGroup {
  group: string;
  teeTime: string;
  members: string[];
}

export interface NextRoundParticipant {
  no: number;
  name: string;
  note?: string;
}

export interface NextRoundPlanItem {
  label: string;
  time: string;
  content: string;
  note?: string;
}

export const nextRoundParticipants: NextRoundParticipant[] = [
  { no: 1, name: '유만종', note: '회장' },
  { no: 2, name: '양창운', note: '총무' },
  { no: 3, name: '이상우' },
  { no: 4, name: '모성진' },
  { no: 5, name: '김영웅' },
  { no: 6, name: '정재엽' },
  { no: 7, name: '김성진' },
  { no: 8, name: '김성태' },
  { no: 9, name: '김효민' },
  { no: 10, name: '김도윤' },
  { no: 11, name: '신연성' },
  { no: 12, name: '박준석(게스트)' },
];

export const nextRoundGroups: RoundGroup[] = [
  { group: '1팀', teeTime: '06:03', members: ['이상우', '신연성', '김효민', '김성진'] },
  { group: '2팀', teeTime: '06:10', members: ['모성진', '양창운', '유만종', '박준석(게스트)'] },
  { group: '3팀', teeTime: '06:17', members: ['정재엽', '김영웅', '김성태', '김도윤'] },
];

export const nextRoundPlan: NextRoundPlanItem[] = [
  { label: '클하 집합', time: '05:40', content: '단체사진 촬영' },
  { label: '티업 시작', time: '06:03', content: '첫 팀 라운딩 시작' },
  { label: '점심식사', time: '12:00', content: '천년소나무', note: '하남 감북동 456-8 · 김성진 청모' },
];
