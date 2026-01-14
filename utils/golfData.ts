
export interface MemberData {
    name: string;
    role: string;
    phone?: string;
    since: string;
    prevHandicap: number;
    scoreHistory: number[]; // Gross scores
    holeScores?: number[][]; // Latest round hole scores
    img: string;
}

// Course Par Data (Bella, Luce) - Total 72
export const PAR_DATA = [4, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 4, 4, 3, 5, 3, 4];

// Raw Membership Data
export const members: MemberData[] = [
    {
        name: '정재엽', role: '정회원', prevHandicap: 18.0,
        scoreHistory: [90],
        holeScores: [[4, 6, 4, 3, 6, 4, 5, 6, 6, 5, 5, 6, 5, 5, 4, 6, 4, 5]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JaeYeop&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01026219101'
    },
    {
        name: '모성진', role: '정회원', prevHandicap: 21.0,
        scoreHistory: [93],
        holeScores: [[6, 5, 6, 3, 6, 4, 3, 5, 7, 5, 6, 5, 6, 7, 4, 7, 4, 4]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=SungJin&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01047682858'
    },
    {
        name: '유만종', role: '회장', prevHandicap: 19.5,
        scoreHistory: [94],
        holeScores: [[6, 8, 7, 3, 4, 5, 3, 6, 5, 6, 7, 5, 6, 6, 4, 5, 3, 5]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ManJong&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01031999922'
    },
    {
        name: '김영웅', role: '정회원', prevHandicap: 22.0,
        scoreHistory: [95],
        holeScores: [[4, 6, 5, 4, 5, 5, 4, 5, 6, 6, 8, 7, 5, 7, 4, 7, 2, 5]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=YoungWoong&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01028104255'
    },
    {
        name: '신연성', role: '정회원', prevHandicap: 23.5,
        scoreHistory: [97],
        holeScores: [[7, 6, 6, 3, 5, 5, 4, 5, 5, 4, 6, 6, 7, 7, 5, 7, 3, 6]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=YeonSeong&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01026966518'
    },
    {
        name: '양창운', role: '총무', prevHandicap: 18.5,
        scoreHistory: [101],
        holeScores: [[5, 8, 6, 4, 4, 7, 3, 7, 7, 5, 5, 7, 5, 6, 4, 8, 5, 5]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ChangWoon&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01085426586'
    },
    {
        name: '김효민', role: '정회원', prevHandicap: 24.0,
        scoreHistory: [102],
        holeScores: [[4, 6, 8, 4, 7, 5, 4, 5, 6, 4, 7, 7, 8, 7, 4, 8, 3, 5]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=HyoMin&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01093014798'
    },
    {
        name: '최재호', role: '정회원', prevHandicap: 28.5,
        scoreHistory: [112],
        holeScores: [[7, 8, 7, 3, 4, 7, 5, 8, 5, 7, 6, 7, 6, 8, 6, 8, 3, 7]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JaeHo&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01022698528'
    },
    {
        name: '홍지훈', role: '정회원', prevHandicap: 32.0,
        scoreHistory: [124],
        holeScores: [[7, 9, 7, 6, 6, 6, 5, 10, 7, 6, 7, 8, 6, 8, 5, 10, 4, 7]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JiHoon&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01041520738'
    },
    {
        name: '김성태', role: '정회원', prevHandicap: 31.5,
        scoreHistory: [126],
        holeScores: [[6, 10, 6, 6, 7, 7, 5, 6, 8, 7, 8, 8, 8, 7, 6, 9, 5, 7]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=SungTae&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01049029220'
    },
    {
        name: '김성진', role: '정회원', prevHandicap: 33.0,
        scoreHistory: [127],
        holeScores: [[7, 8, 8, 6, 8, 8, 4, 9, 7, 7, 8, 8, 8, 8, 5, 7, 4, 7]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=SungJin2&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01020840638'
    },
    {
        name: '김도윤', role: '정회원', prevHandicap: 37.0,
        scoreHistory: [132],
        holeScores: [[8, 9, 8, 6, 8, 7, 5, 8, 8, 7, 8, 8, 8, 6, 6, 9, 5, 8]],
        img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=DoYoon&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01089463040'
    },
    { name: '김경준', role: '정회원', prevHandicap: 18.0, scoreHistory: [], img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=KyungJun&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01040261184' },
    { name: '김준영', role: '정회원', prevHandicap: 18.0, scoreHistory: [], img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JunYoung&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01026342572' },
    { name: '홍장표', role: '정회원', prevHandicap: 18.0, scoreHistory: [], img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JangPyo&backgroundColor=f8fafc,f1f5f9', since: '2023.01', phone: '01071659043' },
];

export const calculateAdjustedGross = (holeScores: number[], currentHandicap: number) => {
    if (!holeScores || holeScores.length !== 18) return 0;

    let adjustedGross = 0;
    const baseStrokes = Math.floor(currentHandicap / 18);
    const remainder = Math.floor(currentHandicap % 18);

    holeScores.forEach((score, idx) => {
        const strokesReceived = baseStrokes + (idx < remainder ? 1 : 0);
        const maxScore = PAR_DATA[idx] + 2 + strokesReceived;
        adjustedGross += Math.min(score, maxScore);
    });

    return adjustedGross;
};

export const calculateWHSIndex = (history: { gross: number, adjusted: number }[]) => {
    if (history.length === 0) return 0;

    const differentials = history.map(h => h.adjusted - 72);
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
    return members.map(m => {
        let latestAdjusted = 0;

        if (m.holeScores && m.holeScores.length > 0) {
            latestAdjusted = calculateAdjustedGross(m.holeScores[0], m.prevHandicap);
        }

        const historyObjects = m.scoreHistory.map((gross, i) => {
            const adj = (i === 0 && latestAdjusted > 0) ? latestAdjusted : gross;
            return { gross, adjusted: adj };
        });

        const newHandicap = calculateWHSIndex(historyObjects);
        const latestGross = m.scoreHistory.length > 0 ? m.scoreHistory[0] : 0;
        const net = latestGross > 0 ? parseFloat((latestGross - newHandicap).toFixed(1)) : 999; // 999 for sorting

        return {
            ...m,
            handicap: newHandicap,
            latestScore: latestGross === 0 ? '-' : latestGross,
            latestAdjusted: latestAdjusted === 0 ? '-' : latestAdjusted,
            netScoreDisplay: latestGross > 0 ? (latestGross - newHandicap).toFixed(1) : '-',
            netScoreValue: net,
            improved: m.scoreHistory.length > 1 && newHandicap < m.prevHandicap
        };
    }).sort((a, b) => a.netScoreValue - b.netScoreValue);
};

// Rounding Records
export interface RoundingRecord {
    date: string;
    location: string;
    winner: string;
    score: number;
    attendees: { name: string; score: number; front: number; back: number }[];
}

export const records: RoundingRecord[] = [
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
        ]
    },
];

// Course Coordinates for Maps
export const COURSE_LOCATIONS: Record<string, { lat: number; lng: number; address: string; img: string }> = {
    '더 시에나 벨루토 CC (여주)': {
        lat: 37.227445,
        lng: 127.618625,
        address: '경기 여주시 북내면 가정리 산3-1',
        img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400'
    },
};

// Gallery Photos
export interface PhotoItem {
    id: string;
    src: string;
    date: string;
    location: string;
    bestScore: number | string;
    participants: number;
    category: '2026' | '2025' | 'Memories';
}

export const galleryPhotos: PhotoItem[] = [
    { id: 'new-1', src: '/images/round1_group.jpg', date: '2025.11.29', location: 'The Sienna Velluto CC', bestScore: 90, participants: 12, category: '2025' },
];
