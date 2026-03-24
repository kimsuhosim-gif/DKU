export interface MemberData {
    name: string;
    role: string;
    phone?: string;
    since: string;
    prevHandicap: number;
    scoreHistory: number[];
    holeScores?: number[][];
    img: string;
}

export const PAR_DATA = [4, 5, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 4, 4, 3, 5, 3, 4];

export const members: MemberData[] = [
    {
        name: 'J. Park',
        role: 'member',
        prevHandicap: 18.0,
        scoreHistory: [90],
        holeScores: [[4, 6, 4, 3, 6, 4, 5, 6, 6, 5, 5, 6, 5, 5, 4, 6, 4, 5]],
        img: 'https://i.pravatar.cc/320?img=12',
        since: '2023.01',
        phone: '010-2621-9101'
    },
    {
        name: 'S. Moon',
        role: 'member',
        prevHandicap: 21.0,
        scoreHistory: [93],
        holeScores: [[6, 5, 6, 3, 6, 4, 3, 5, 7, 5, 6, 5, 6, 7, 4, 7, 4, 4]],
        img: 'https://i.pravatar.cc/320?img=13',
        since: '2023.01',
        phone: '010-4768-2858'
    },
    {
        name: 'M. Cho',
        role: 'captain',
        prevHandicap: 19.5,
        scoreHistory: [94],
        holeScores: [[6, 8, 7, 3, 4, 5, 3, 6, 5, 6, 7, 5, 6, 6, 4, 5, 3, 5]],
        img: 'https://i.pravatar.cc/320?img=14',
        since: '2023.01',
        phone: '010-3199-9922'
    },
    {
        name: 'Y. Kim',
        role: 'member',
        prevHandicap: 22.0,
        scoreHistory: [95],
        holeScores: [[4, 6, 5, 4, 5, 5, 4, 5, 6, 6, 8, 7, 5, 7, 4, 7, 2, 5]],
        img: 'https://i.pravatar.cc/320?img=15',
        since: '2023.01',
        phone: '010-2810-4255'
    },
    {
        name: 'Y. Yoo',
        role: 'member',
        prevHandicap: 23.5,
        scoreHistory: [97],
        holeScores: [[7, 6, 6, 3, 5, 5, 4, 5, 5, 4, 6, 6, 7, 7, 5, 7, 3, 6]],
        img: 'https://i.pravatar.cc/320?img=16',
        since: '2023.01',
        phone: '010-2696-6518'
    },
    {
        name: 'J. Lim',
        role: 'secretary',
        prevHandicap: 18.5,
        scoreHistory: [101],
        holeScores: [[5, 8, 6, 4, 4, 7, 3, 7, 7, 5, 5, 7, 5, 6, 4, 8, 5, 5]],
        img: 'https://i.pravatar.cc/320?img=17',
        since: '2023.01',
        phone: '010-8542-6586'
    },
    {
        name: 'D. Kim',
        role: 'member',
        prevHandicap: 24.0,
        scoreHistory: [102],
        holeScores: [[4, 6, 8, 4, 7, 5, 4, 5, 6, 4, 7, 7, 8, 7, 4, 8, 3, 5]],
        img: 'https://i.pravatar.cc/320?img=18',
        since: '2023.01',
        phone: '010-9301-4798'
    },
    {
        name: 'J. Choi',
        role: 'member',
        prevHandicap: 28.5,
        scoreHistory: [112],
        holeScores: [[7, 8, 7, 3, 4, 7, 5, 8, 5, 7, 6, 7, 6, 8, 6, 8, 3, 7]],
        img: 'https://i.pravatar.cc/320?img=19',
        since: '2023.01',
        phone: '010-2269-8528'
    },
    {
        name: 'T. Tak',
        role: 'member',
        prevHandicap: 32.0,
        scoreHistory: [124],
        holeScores: [[7, 9, 7, 6, 6, 6, 5, 10, 7, 6, 7, 8, 6, 8, 5, 10, 4, 7]],
        img: 'https://i.pravatar.cc/320?img=20',
        since: '2023.01',
        phone: '010-4152-0738'
    },
    {
        name: 'T. Kim',
        role: 'member',
        prevHandicap: 31.5,
        scoreHistory: [126],
        holeScores: [[6, 10, 6, 6, 7, 7, 5, 6, 8, 7, 8, 8, 8, 7, 6, 9, 5, 7]],
        img: 'https://i.pravatar.cc/320?img=21',
        since: '2023.01',
        phone: '010-4902-9220'
    },
    {
        name: 'J. Kim',
        role: 'member',
        prevHandicap: 33.0,
        scoreHistory: [127],
        holeScores: [[7, 8, 8, 6, 8, 8, 4, 9, 7, 7, 8, 8, 8, 8, 5, 7, 4, 7]],
        img: 'https://i.pravatar.cc/320?img=22',
        since: '2023.01',
        phone: '010-2084-0638'
    },
    {
        name: 'A. Kim',
        role: 'member',
        prevHandicap: 37.0,
        scoreHistory: [132],
        holeScores: [[8, 9, 8, 6, 8, 7, 5, 8, 8, 7, 8, 8, 8, 6, 6, 9, 5, 8]],
        img: 'https://i.pravatar.cc/320?img=23',
        since: '2023.01',
        phone: '010-8946-3040'
    },
    {
        name: 'K. Kim',
        role: 'member',
        prevHandicap: 18.0,
        scoreHistory: [],
        img: 'https://i.pravatar.cc/320?img=24',
        since: '2023.01',
        phone: '010-4026-1184'
    },
    {
        name: 'J. Kim',
        role: 'member',
        prevHandicap: 18.0,
        scoreHistory: [],
        img: 'https://i.pravatar.cc/320?img=25',
        since: '2023.01',
        phone: '010-2634-2572'
    },
    {
        name: 'J. Tak',
        role: 'member',
        prevHandicap: 18.0,
        scoreHistory: [],
        img: 'https://i.pravatar.cc/320?img=26',
        since: '2023.01',
        phone: '010-7165-9043'
    },
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
    if (count <= 5) bestN = 1;
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
        const net = latestGross > 0 ? parseFloat((latestGross - newHandicap).toFixed(1)) : 999;

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
        location: 'The Sienna Velluto CC',
        winner: 'J. Park',
        score: 90,
        attendees: [
            { name: 'J. Park', score: 90, front: 45, back: 45 },
            { name: 'S. Moon', score: 93, front: 45, back: 48 },
            { name: 'M. Cho', score: 94, front: 47, back: 47 },
            { name: 'Y. Kim', score: 95, front: 44, back: 51 },
            { name: 'Y. Yoo', score: 97, front: 46, back: 51 },
            { name: 'J. Lim', score: 101, front: 51, back: 50 },
            { name: 'D. Kim', score: 102, front: 49, back: 53 },
            { name: 'J. Choi', score: 112, front: 54, back: 58 },
            { name: 'T. Tak', score: 124, front: 63, back: 61 },
            { name: 'T. Kim', score: 126, front: 61, back: 65 },
            { name: 'J. Kim', score: 127, front: 65, back: 62 },
            { name: 'A. Kim', score: 132, front: 67, back: 65 },
        ]
    },
    {
        date: '2025.08.24',
        location: 'South Springs CC',
        winner: 'M. Cho',
        score: 92,
        attendees: [
            { name: 'M. Cho', score: 92, front: 45, back: 47 },
            { name: 'J. Park', score: 94, front: 46, back: 48 },
            { name: 'S. Moon', score: 96, front: 48, back: 48 },
            { name: 'Y. Kim', score: 98, front: 50, back: 48 },
            { name: 'J. Lim', score: 103, front: 52, back: 51 },
            { name: 'D. Kim', score: 105, front: 53, back: 52 },
        ]
    },
];

export const COURSE_LOCATIONS: Record<string, { lat: number; lng: number; address: string; img: string }> = {
    'The Sienna Velluto CC': {
        lat: 37.227445,
        lng: 127.618625,
        address: 'Yeoju-si, Gyeonggi-do',
        img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400&auto=format&fit=crop'
    },
    'South Springs CC': {
        lat: 37.392507,
        lng: 127.243112,
        address: 'Icheon-si, Gyeonggi-do',
        img: 'https://images.unsplash.com/photo-1560937084-f2126a5a4f66?q=80&w=400&auto=format&fit=crop'
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

export const galleryPhotos: PhotoItem[] = [
    {
        id: 'new-1',
        src: 'https://images.unsplash.com/photo-1513553404607-988d4c6ca6e9?q=80&w=1200&auto=format&fit=crop',
        date: '2025.11.29',
        location: 'The Sienna Velluto CC',
        bestScore: 90,
        participants: 12,
        category: '2025'
    },
    {
        id: 'new-2',
        src: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop',
        date: '2025.11.29',
        location: 'Clubhouse Terrace',
        bestScore: 'Archive',
        participants: 12,
        category: 'Memories'
    },
    {
        id: 'new-3',
        src: 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop',
        date: '2025.11.29',
        location: 'Practice Green',
        bestScore: 'Warm-up',
        participants: 12,
        category: 'Memories'
    },
];
