import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Coins, Info, Play, RotateCcw, Users } from 'lucide-react';

interface MoneyGameSectionProps {
  onBack: () => void;
}

type GameMode = 'stroke' | 'holeStroke' | 'skins' | 'nassau' | 'vegas';

const gameModes: { mode: GameMode; label: string; title: string; rule: string; input: string }[] = [
  {
    mode: 'stroke',
    label: '타당',
    title: '총타수 타당',
    rule: '라운드 전체 총타수에서 개인 핸디를 뺀 Net 타수로 비교하고, 차이 1타마다 선택한 금액을 주고받습니다.',
    input: '총타수만 입력하면 핸디를 자동 반영합니다.',
  },
  {
    mode: 'holeStroke',
    label: '홀별 타당',
    title: '홀별 타당',
    rule: '각 홀마다 4명이 서로 전원 비교합니다. 4명 전원 동타인 홀은 다음 홀을 배판으로 넘깁니다.',
    input: '18홀 스코어를 입력하면 홀마다 타수 차이와 동타 배판을 자동 정산합니다.',
  },
  {
    mode: 'skins',
    label: '스킨스',
    title: '스킨스',
    rule: '홀 난이도 순번대로 핸디 스트로크를 배정한 뒤, 각 홀의 단독 최저 Net 스코어가 팟을 가져갑니다.',
    input: '18홀의 홀별 스코어와 필요하면 홀 난이도 순번을 조정합니다.',
  },
  {
    mode: 'nassau',
    label: '나소',
    title: '나소 2:2',
    rule: '1/2번이 A팀, 3/4번이 B팀입니다. 개인 핸디를 전후반 홀 난이도에 배정해 전반, 후반, 전체를 각각 계산합니다.',
    input: '멤버별 전반/후반 스코어를 입력하면 핸디가 자동 차감됩니다.',
  },
  {
    mode: 'vegas',
    label: '라스베가스',
    title: '라스베가스 2:2',
    rule: '홀별 Net 스코어를 낮은 숫자부터 붙여 팀 숫자를 만들고, 홀마다 숫자 차이를 누적합니다.',
    input: '18홀의 홀별 스코어와 필요하면 홀 난이도 순번을 조정합니다.',
  },
];

const defaultNames = ['', '', '', ''];
const defaultHandicaps = ['', '', '', ''];
const defaultTotals = ['', '', '', ''];
const defaultHoleIndexes = Array.from({ length: 18 }, (_, index) => String(index + 1));
const unitOptions = [1000, 2000, 5000, 10000];
const makeDefaultFrontBack = () => Array.from({ length: 4 }, () => ['', '']);
const makeEmptyHoles = () => Array.from({ length: 4 }, () => Array.from({ length: 18 }, () => ''));

const parseScore = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const parseHandicap = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const parseHoleIndex = (value: string, fallback: number) => {
  const parsed = Math.round(Number(value));
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 18 ? parsed : fallback;
};

const getHoleHandicapStrokes = (handicap: number, holeIndexes: number[]) => {
  const wholeHandicap = Math.floor(Math.max(0, handicap));
  const base = Math.floor(wholeHandicap / 18);
  const extra = wholeHandicap % 18;

  return holeIndexes.map((holeIndex) => base + (holeIndex <= extra ? 1 : 0));
};

const formatAmount = (amount: number) => {
  if (amount === 0) return '0';
  return `${amount > 0 ? '+' : '-'}₩${Math.abs(Math.round(amount)).toLocaleString()}`;
};

const formatUnitLabel = (amount: number) => {
  if (amount === 10000) return '1만원';
  return `${amount / 1000}천원`;
};

const MoneyGameSection: React.FC<MoneyGameSectionProps> = ({ onBack }) => {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<GameMode>('stroke');
  const [unit, setUnit] = useState(5000);
  const [playerNames, setPlayerNames] = useState(() => [...defaultNames]);
  const [handicaps, setHandicaps] = useState(() => [...defaultHandicaps]);
  const [totalScores, setTotalScores] = useState(() => [...defaultTotals]);
  const [frontBackScores, setFrontBackScores] = useState(makeDefaultFrontBack);
  const [holeScores, setHoleScores] = useState(makeEmptyHoles);
  const [holeIndexes, setHoleIndexes] = useState(() => [...defaultHoleIndexes]);

  const activeMode = gameModes.find((item) => item.mode === mode) ?? gameModes[0];
  const canStart = playerNames.every((name) => name.trim().length > 0);

  const resetInputs = () => {
    setTotalScores([...defaultTotals]);
    setFrontBackScores(makeDefaultFrontBack());
    setHoleScores(makeEmptyHoles());
    setHoleIndexes([...defaultHoleIndexes]);
  };

  const settlements = useMemo(() => {
    const net = [0, 0, 0, 0];
    const names = playerNames.map((name, index) => name.trim() || `멤버 ${index + 1}`);
    const playerHandicaps = handicaps.map(parseHandicap);
    const parsedHoleIndexes = holeIndexes.map((value, index) => parseHoleIndex(value, index + 1));
    const handicapStrokesByPlayer = playerHandicaps.map((handicap) => getHoleHandicapStrokes(handicap, parsedHoleIndexes));
    const notes: string[] = [];

    if (!started) {
      return { notes: ['멤버를 입력하고 계산을 시작하세요.'], rows: names.map((name) => ({ name, amount: 0 })) };
    }

    if (mode === 'stroke') {
      const scores = totalScores.map(parseScore);
      if (scores.some((score) => score === 0)) {
        return { notes: ['4명의 총타수를 모두 입력하면 정산됩니다.'], rows: names.map((name) => ({ name, amount: 0 })) };
      }
      const netScores = scores.map((score, index) => score - playerHandicaps[index]);

      netScores.forEach((score, i) => {
        netScores.slice(i + 1).forEach((opponentScore, relativeIndex) => {
          const j = i + relativeIndex + 1;
          const diff = Math.abs(score - opponentScore);
          if (!diff) return;
          const winner = score < opponentScore ? i : j;
          const loser = score < opponentScore ? j : i;
          net[winner] += diff * unit;
          net[loser] -= diff * unit;
        });
      });
      notes.push('Net 타수 차이 1타마다 선택한 금액으로 정산했습니다.');
    }

    if (mode === 'holeStroke') {
      const scores = holeScores.map((row) => row.map(parseScore));
      const completedHoles = Array.from({ length: 18 }, (_, hole) => hole).filter((hole) => scores.every((row) => row[hole] > 0));

      if (!completedHoles.length) {
        return { notes: ['완료된 홀의 4명 스코어를 입력하면 바로 정산됩니다.'], rows: names.map((name) => ({ name, amount: 0 })) };
      }

      const bigHoles: string[] = [];
      const tiedHoles: string[] = [];
      const doubleHoles: string[] = [];
      let nextHoleMultiplier = 1;
      completedHoles.forEach((hole) => {
        const netHoleScores = scores.map((row, index) => row[hole] - handicapStrokesByPlayer[index][hole]);
        const spread = Math.max(...netHoleScores) - Math.min(...netHoleScores);

        if (spread === 0) {
          tiedHoles.push(`${hole + 1}H`);
          nextHoleMultiplier = 2;
          return;
        }

        const holeUnit = unit * nextHoleMultiplier;
        if (nextHoleMultiplier > 1) {
          doubleHoles.push(`${hole + 1}H`);
        }

        netHoleScores.forEach((score, i) => {
          netHoleScores.slice(i + 1).forEach((opponentScore, relativeIndex) => {
            const j = i + relativeIndex + 1;
            const diff = Math.abs(score - opponentScore);
            if (!diff) return;
            const winner = score < opponentScore ? i : j;
            const loser = score < opponentScore ? j : i;
            net[winner] += diff * holeUnit;
            net[loser] -= diff * holeUnit;
          });
        });

        nextHoleMultiplier = 1;
        if (spread >= 3) {
          bigHoles.push(`${hole + 1}H ${spread}타 차`);
        }
      });

      notes.push(`입력된 ${completedHoles.length}개 홀 기준으로 정산했습니다.`);
      notes.push('버디 배판은 없고, 4명 전원 동타인 홀만 다음 완료 홀을 2배로 정산합니다.');
      notes.push('예: 버디/파/보기/더블이면 더블은 보기에게 1천원, 파에게 2천원, 버디에게 3천원을 줍니다.');
      if (tiedHoles.length) notes.push(`전원 동타 이월: ${tiedHoles.slice(0, 8).join(' · ')}`);
      if (doubleHoles.length) notes.push(`배판 적용: ${doubleHoles.slice(0, 8).join(' · ')}`);
      if (nextHoleMultiplier > 1) notes.push('마지막 입력 홀의 전원 동타는 다음 완료 홀에 배판으로 적용됩니다.');
      if (bigHoles.length) notes.push(`큰 차이 홀: ${bigHoles.slice(0, 6).join(' · ')}`);
    }

    if (mode === 'skins') {
      const scores = holeScores.map((row) => row.map(parseScore));
      if (scores.some((row) => row.some((score) => score === 0))) {
        return { notes: ['18홀 x 4명의 홀별 스코어를 모두 입력하면 정산됩니다.'], rows: names.map((name) => ({ name, amount: 0 })) };
      }

      let pot = 0;
      const winners: string[] = [];
      for (let hole = 0; hole < 18; hole += 1) {
        pot += unit * 4;
        names.forEach((_, index) => {
          net[index] -= unit;
        });
        const low = Math.min(...scores.map((row, index) => row[hole] - handicapStrokesByPlayer[index][hole]));
        const holeWinners = scores
          .map((row, index) => ({ score: row[hole] - handicapStrokesByPlayer[index][hole], index }))
          .filter((item) => item.score === low);
        if (holeWinners.length === 1) {
          const winnerName = names[holeWinners[0].index];
          net[holeWinners[0].index] += pot;
          winners.push(`${hole + 1}H ${winnerName}`);
          pot = 0;
        }
      }

      if (pot > 0) {
        names.forEach((_, index) => {
          net[index] += pot / 4;
        });
        notes.push('마지막까지 이월된 팟은 4명에게 균등 반환했습니다.');
      }
      notes.push('홀별 게임은 홀 난이도 1~18 순번에 따라 핸디 스트로크를 배정했습니다.');
      notes.push(winners.length ? winners.slice(0, 8).join(' · ') : '단독 홀 승자가 없습니다.');
    }

    if (mode === 'nassau') {
      const scores = frontBackScores.map((row) => row.map(parseScore));
      if (scores.some((row) => row.some((score) => score === 0))) {
        return { notes: ['4명의 전반/후반 스코어를 모두 입력하면 정산됩니다.'], rows: names.map((name) => ({ name, amount: 0 })) };
      }

      const teamA = [0, 1];
      const teamB = [2, 3];
      const segmentHandicap = (playerIndex: number, segment: 0 | 1 | 'all') => {
        if (segment === 'all') return handicapStrokesByPlayer[playerIndex].reduce((sum, stroke) => sum + stroke, 0);
        const start = segment === 0 ? 0 : 9;
        const end = segment === 0 ? 9 : 18;
        return handicapStrokesByPlayer[playerIndex].slice(start, end).reduce((sum, stroke) => sum + stroke, 0);
      };
      const teamTotal = (team: number[], segment: 0 | 1 | 'all') =>
        team.reduce((sum, index) => {
          if (segment === 'all') return sum + scores[index][0] + scores[index][1] - segmentHandicap(index, segment);
          return sum + scores[index][segment] - segmentHandicap(index, segment);
        }, 0);
      const segments = [
        { label: '전반', a: teamTotal(teamA, 0), b: teamTotal(teamB, 0) },
        { label: '후반', a: teamTotal(teamA, 1), b: teamTotal(teamB, 1) },
        { label: '전체', a: teamTotal(teamA, 'all'), b: teamTotal(teamB, 'all') },
      ];

      segments.forEach((segment) => {
        if (segment.a === segment.b) {
          notes.push(`${segment.label} 무승부`);
          return;
        }
        const winnerTeam = segment.a < segment.b ? teamA : teamB;
        const loserTeam = segment.a < segment.b ? teamB : teamA;
        winnerTeam.forEach((index) => {
          net[index] += unit;
        });
        loserTeam.forEach((index) => {
          net[index] -= unit;
        });
        notes.push(`${segment.label} ${winnerTeam.map((index) => names[index]).join('/')} 승`);
      });
      notes.push('나소는 홀 난이도 순번으로 전반/후반 핸디 스트로크를 나눠 반영했습니다.');
    }

    if (mode === 'vegas') {
      const scores = holeScores.map((row) => row.map(parseScore));
      if (scores.some((row) => row.some((score) => score === 0))) {
        return { notes: ['18홀 x 4명의 홀별 스코어를 모두 입력하면 정산됩니다.'], rows: names.map((name) => ({ name, amount: 0 })) };
      }

      const pairNumber = (a: number, b: number) => Math.min(a, b) * 10 + Math.max(a, b);
      let points = 0;
      for (let hole = 0; hole < 18; hole += 1) {
        const teamA = pairNumber(scores[0][hole] - handicapStrokesByPlayer[0][hole], scores[1][hole] - handicapStrokesByPlayer[1][hole]);
        const teamB = pairNumber(scores[2][hole] - handicapStrokesByPlayer[2][hole], scores[3][hole] - handicapStrokesByPlayer[3][hole]);
        points += teamB - teamA;
      }
      const amount = Math.abs(points) * unit;
      if (points > 0) {
        [0, 1].forEach((index) => {
          net[index] += amount / 2;
        });
        [2, 3].forEach((index) => {
          net[index] -= amount / 2;
        });
        notes.push(`${names[0]}/${names[1]} 팀 ${points}점 승`);
      } else if (points < 0) {
        [0, 1].forEach((index) => {
          net[index] -= amount / 2;
        });
        [2, 3].forEach((index) => {
          net[index] += amount / 2;
        });
        notes.push(`${names[2]}/${names[3]} 팀 ${Math.abs(points)}점 승`);
      } else {
        notes.push('라스베가스 무승부');
      }
      notes.push('라스베가스는 핸디 적용 후의 홀별 Net 스코어로 팀 숫자를 만들었습니다.');
    }

    return {
      notes,
      rows: names.map((name, index) => ({ name, amount: net[index] })).sort((a, b) => b.amount - a.amount),
    };
  }, [frontBackScores, handicaps, holeIndexes, holeScores, mode, playerNames, started, totalScores, unit]);

  const updateName = (index: number, value: string) => {
    setPlayerNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  };

  const updateHandicap = (index: number, value: string) => {
    setHandicaps((prev) => prev.map((handicap, i) => (i === index ? value : handicap)));
  };

  const updateTotal = (index: number, value: string) => {
    setTotalScores((prev) => prev.map((score, i) => (i === index ? value : score)));
  };

  const updateFrontBack = (playerIndex: number, segmentIndex: number, value: string) => {
    setFrontBackScores((prev) => prev.map((row, i) => (i === playerIndex ? row.map((score, j) => (j === segmentIndex ? value : score)) : row)));
  };

  const updateHole = (playerIndex: number, holeIndex: number, value: string) => {
    setHoleScores((prev) => prev.map((row, i) => (i === playerIndex ? row.map((score, j) => (j === holeIndex ? value : score)) : row)));
  };

  const updateHoleIndex = (holeIndex: number, value: string) => {
    setHoleIndexes((prev) => prev.map((item, i) => (i === holeIndex ? value : item)));
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4c5d47] transition hover:text-[#172117]"
        >
          <ArrowLeft size={16} />
          홈으로
        </button>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] border border-[#344433] bg-[#101810] p-5 text-[#fffaf2] shadow-[0_34px_90px_-70px_rgba(23,33,23,0.8)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#d8c39a]">내기 계산기</p>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8c39a]/25 bg-white/10 text-[#d8c39a]">
                <Calculator size={18} />
              </span>
            </div>
            <h1 className="mt-4 break-keep font-serif text-3xl italic leading-tight sm:text-4xl">골프 내기 정산 계산기</h1>
            <p className="mt-4 break-keep text-sm font-semibold leading-7 text-white/62">
              멤버, 핸디, 스코어는 저장하지 않습니다. 다른 메뉴로 나가면 전부 사라집니다.
            </p>

            <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-[#d8c39a]/24 bg-white/8">
              <div className="relative aspect-[16/10]">
                <img src="/images/money-game-ai.png" alt="Money game desk visual" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,16,0.02)_0%,rgba(16,24,16,0.72)_100%)]" />
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {gameModes.map((game) => (
                <button
                  key={game.mode}
                  type="button"
                  onClick={() => setMode(game.mode)}
                  className={`w-full rounded-[1.3rem] border p-4 text-left transition ${
                    mode === game.mode ? 'border-[#d8c39a] bg-[#fffaf2] text-[#172117]' : 'border-white/10 bg-white/8 text-[#fffaf2] hover:border-[#d8c39a]/45'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-60">{game.label}</p>
                  <p className="mt-1 text-base font-bold">{game.title}</p>
                  <p className="mt-2 break-keep text-xs font-semibold leading-5 opacity-70">{game.rule}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-5">
            <div className="rounded-[2rem] border border-[#d6c5a8] bg-[#fffaf2] p-5 shadow-[0_26px_80px_-70px_rgba(23,33,23,0.4)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#172117]">멤버와 핸디 입력</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unitOptions.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setUnit(amount)}
                      className={`rounded-full px-4 py-2 text-[11px] font-bold transition ${
                        unit === amount ? 'bg-[#172117] text-[#fffaf2]' : 'border border-[#d6c5a8] bg-[#fbf7ef] text-[#4c5d47] hover:bg-[#efe6d8]'
                      }`}
                    >
                      {formatUnitLabel(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {playerNames.map((name, index) => (
                  <div key={index} className="block rounded-[1.25rem] border border-[#d6c5a8] bg-[#fbf7ef] p-4">
                    <span className="text-[10px] font-bold tracking-[0.16em] text-[#847765]">멤버 {index + 1}</span>
                    <input
                      value={name}
                      onChange={(event) => updateName(index, event.target.value)}
                      aria-label={`Player ${index + 1} 이름`}
                      placeholder={`멤버 ${index + 1}`}
                      className="mt-3 w-full rounded-xl border border-[#d6c5a8] bg-[#fffaf2] px-3 py-3 text-sm font-bold text-[#172117] outline-none transition focus:border-[#b9975b]"
                    />
                    <div className="mt-2 grid grid-cols-[1fr_5.5rem] items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#66785c]">개인 핸디</span>
                      <input
                        value={handicaps[index]}
                        onChange={(event) => updateHandicap(index, event.target.value)}
                        aria-label={`Player ${index + 1} 핸디`}
                        inputMode="decimal"
                        placeholder="0"
                        className="w-full rounded-xl border border-[#d6c5a8] bg-[#fffaf2] px-3 py-2.5 text-center text-sm font-bold text-[#172117] outline-none transition focus:border-[#b9975b]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!canStart}
                  onClick={() => setStarted(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172117] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fffaf2] transition hover:bg-[#344433] disabled:cursor-not-allowed disabled:bg-[#d6c5a8] disabled:text-[#847765]"
                >
                  계산 시작
                  <Play size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStarted(false);
                    setPlayerNames([...defaultNames]);
                    setHandicaps([...defaultHandicaps]);
                    resetInputs();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6c5a8] bg-[#fffaf2] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4c5d47] transition hover:bg-[#efe6d8]"
                >
                  초기화
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d6c5a8] bg-[#fffaf2] p-5 shadow-[0_26px_80px_-70px_rgba(23,33,23,0.4)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#172117]">{activeMode.title}</h2>
                  <p className="mt-2 break-keep text-sm font-semibold leading-6 text-[#66785c]">{activeMode.input}</p>
                </div>
                <div className="rounded-[1.2rem] border border-[#d6c5a8] bg-[#fbf7ef] p-4 text-sm font-semibold leading-6 text-[#4c5d47] lg:max-w-md">
                  <div className="mb-2 flex items-center gap-2 text-[#172117]">
                    <Info size={15} />
                    <span className="text-xs font-bold uppercase tracking-[0.14em]">하는 방법</span>
                  </div>
                  {activeMode.rule}
                </div>
              </div>

              {!started ? (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#d6c5a8] bg-[#fbf7ef] p-8 text-center">
                  <Users className="mx-auto text-[#b9975b]" size={28} />
                  <p className="mt-4 text-sm font-bold text-[#172117]">멤버 4명을 입력한 뒤 계산을 시작하세요.</p>
                </div>
              ) : null}

              {started && mode === 'stroke' ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {playerNames.map((name, index) => (
                    <label key={`${name}-${index}`} className="rounded-[1.25rem] border border-[#d6c5a8] bg-[#fbf7ef] p-4">
                      <span className="text-xs font-bold text-[#4c5d47]">{name}</span>
                      <input
                        value={totalScores[index]}
                        onChange={(event) => updateTotal(index, event.target.value)}
                        inputMode="numeric"
                        placeholder="총타수"
                        className="mt-3 w-full rounded-xl border border-[#d6c5a8] bg-[#fffaf2] px-3 py-3 text-lg font-bold text-[#172117] outline-none focus:border-[#b9975b]"
                      />
                    </label>
                  ))}
                </div>
              ) : null}

              {started && mode === 'nassau' ? (
                <div className="mt-6 space-y-4">
                  <div className="overflow-x-auto rounded-[1.25rem] border border-[#d6c5a8] bg-[#fbf7ef] p-3">
                    <div className="grid min-w-[980px] grid-cols-[7rem_repeat(18,2.6rem)] gap-1">
                      <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#847765]">Hole</div>
                      {Array.from({ length: 18 }, (_, index) => (
                        <div key={`nassau-hole-${index}`} className="rounded-lg bg-[#efe6d8] px-2 py-2 text-center text-xs font-bold text-[#4c5d47]">
                          {index + 1}
                        </div>
                      ))}
                      <div className="flex items-center px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#847765]">핸디 순번</div>
                      {Array.from({ length: 18 }, (_, holeIndex) => (
                        <input
                          key={`nassau-hole-index-${holeIndex}`}
                          value={holeIndexes[holeIndex]}
                          onChange={(event) => updateHoleIndex(holeIndex, event.target.value)}
                          inputMode="numeric"
                          aria-label={`${holeIndex + 1}번 홀 핸디 순번`}
                          className="h-10 rounded-lg border border-[#d6c5a8] bg-[#fffaf2] text-center text-xs font-bold text-[#4c5d47] outline-none focus:border-[#b9975b]"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-[#d6c5a8] bg-[#172117] p-4 text-[#fffaf2]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d8c39a]">A Team</p>
                      <p className="mt-2 text-lg font-bold">{playerNames[0]} / {playerNames[1]}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#d6c5a8] bg-[#172117] p-4 text-[#fffaf2]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d8c39a]">B Team</p>
                      <p className="mt-2 text-lg font-bold">{playerNames[2]} / {playerNames[3]}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {playerNames.map((name, playerIndex) => (
                      <div key={`${name}-${playerIndex}`} className="rounded-[1.25rem] border border-[#d6c5a8] bg-[#fbf7ef] p-4">
                        <p className="text-xs font-bold text-[#4c5d47]">{name}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {['전반', '후반'].map((label, segmentIndex) => (
                            <input
                              key={label}
                              value={frontBackScores[playerIndex][segmentIndex]}
                              onChange={(event) => updateFrontBack(playerIndex, segmentIndex, event.target.value)}
                              inputMode="numeric"
                              placeholder={label}
                              className="w-full rounded-xl border border-[#d6c5a8] bg-[#fffaf2] px-3 py-3 text-sm font-bold text-[#172117] outline-none focus:border-[#b9975b]"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {started && (mode === 'holeStroke' || mode === 'skins' || mode === 'vegas') ? (
                <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-[#d6c5a8] bg-[#fbf7ef] p-3">
                  <div className="min-w-[980px]">
                    <div className="grid grid-cols-[7rem_repeat(18,2.6rem)] gap-1">
                      <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#847765]">Hole</div>
                      {Array.from({ length: 18 }, (_, index) => (
                        <div key={index} className="rounded-lg bg-[#efe6d8] px-2 py-2 text-center text-xs font-bold text-[#4c5d47]">
                          {index + 1}
                        </div>
                      ))}
                      <div className="flex items-center px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#847765]">핸디 순번</div>
                      {Array.from({ length: 18 }, (_, holeIndex) => (
                        <input
                          key={`hole-index-${holeIndex}`}
                          value={holeIndexes[holeIndex]}
                          onChange={(event) => updateHoleIndex(holeIndex, event.target.value)}
                          inputMode="numeric"
                          aria-label={`${holeIndex + 1}번 홀 핸디 순번`}
                          className="h-10 rounded-lg border border-[#d6c5a8] bg-[#fffaf2] text-center text-xs font-bold text-[#4c5d47] outline-none focus:border-[#b9975b]"
                        />
                      ))}
                      {playerNames.map((name, playerIndex) => (
                        <React.Fragment key={`${name}-${playerIndex}`}>
                          <div className="flex items-center px-2 text-xs font-bold text-[#172117]">{name}</div>
                          {Array.from({ length: 18 }, (_, holeIndex) => (
                            <input
                              key={holeIndex}
                              value={holeScores[playerIndex][holeIndex]}
                              onChange={(event) => updateHole(playerIndex, holeIndex, event.target.value)}
                              inputMode="numeric"
                              className="h-10 rounded-lg border border-[#d6c5a8] bg-[#fffaf2] text-center text-sm font-bold text-[#172117] outline-none focus:border-[#b9975b]"
                            />
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-[#344433] bg-[#172117] p-5 text-[#fffaf2] shadow-[0_30px_90px_-72px_rgba(23,33,23,0.75)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">정산 결과</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-[#efe3d1]">
                  <Coins size={14} />
                  1타당 {formatUnitLabel(unit)}
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">계산 메모</p>
                  <div className="mt-3 space-y-2">
                    {settlements.notes.map((note, index) => (
                      <p key={`${note}-${index}`} className="break-keep text-sm font-semibold leading-6 text-white/72">{note}</p>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {settlements.rows.map((row, index) => (
                    <div key={`${row.name}-${index}`} className="flex items-center justify-between rounded-[1.1rem] border border-white/10 bg-white/8 px-4 py-3">
                      <span className="text-sm font-bold">{row.name}</span>
                      <span className={`text-sm font-bold ${row.amount >= 0 ? 'text-[#d8c39a]' : 'text-rose-200'}`}>{formatAmount(row.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MoneyGameSection;
