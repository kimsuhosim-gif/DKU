import React, { useMemo, useState } from 'react';
import { ArrowLeft, Award, Copy, Download, Image, RotateCcw, Sparkles, Trophy, Users } from 'lucide-react';
import { members, nextRoundGroups, nextRoundParticipants, nextRoundPlan, nextSchedule, records } from '../utils/golfData';

interface RoundToolsSectionProps {
  onBack: () => void;
}

interface ScoreRow {
  name: string;
  handicap: string;
  gross: string;
  front: string;
  back: string;
}

interface AwardCard {
  label: string;
  name: string;
  value: string;
  detail: string;
  tone: string;
}

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const loadCanvasImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const getInitialRows = (): ScoreRow[] =>
  nextRoundParticipants.map((participant) => {
    const member = members.find((item) => item.name === participant.name);

    return {
      name: participant.name,
      handicap: member?.prevHandicap ? String(member.prevHandicap) : '',
      gross: '',
      front: '',
      back: '',
    };
  });

const scoreFields = [
  { key: 'handicap', label: '핸디' },
  { key: 'gross', label: '총타수' },
  { key: 'front', label: '전반' },
  { key: 'back', label: '후반' },
] as const;

const drawRoundShareCard = async () => {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350;
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const ctx = context;
  ctx.scale(scale, scale);

  const fontFamily = '"Malgun Gothic", "Noto Sans KR", Arial, sans-serif';
  ctx.fillStyle = '#0f170f';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(216,195,154,0.26)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.03)');
  gradient.addColorStop(1, 'rgba(76,93,71,0.38)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(216,195,154,0.34)';
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 54, width - 108, height - 108);

  ctx.fillStyle = '#d8c39a';
  ctx.font = `700 28px ${fontFamily}`;
  ctx.fillText('DKU-RE09 PRIVATE GOLF CLUB', 86, 128);

  ctx.fillStyle = '#fffaf2';
  ctx.font = `700 64px ${fontFamily}`;
  ctx.fillText('2회 정기 라운딩 조편성', 86, 218);

  ctx.fillStyle = 'rgba(255,250,242,0.72)';
  ctx.font = `600 30px ${fontFamily}`;
  ctx.fillText(`${nextSchedule.location} · ${nextSchedule.date}`, 86, 276);

  const meta = [
    ['참석', `${nextRoundParticipants.length}명`],
    ['첫 티업', '06:03'],
    ['점심', '12:00 천년소나무'],
  ];

  meta.forEach(([label, value], index) => {
    const x = 86 + index * 302;
    ctx.fillStyle = 'rgba(255,250,242,0.08)';
    ctx.fillRect(x, 326, 270, 104);
    ctx.strokeStyle = 'rgba(216,195,154,0.22)';
    ctx.strokeRect(x, 326, 270, 104);
    ctx.fillStyle = 'rgba(255,250,242,0.48)';
    ctx.font = `700 18px ${fontFamily}`;
    ctx.fillText(label, x + 24, 366);
    ctx.fillStyle = '#fffaf2';
    ctx.font = `700 28px ${fontFamily}`;
    ctx.fillText(value, x + 24, 404);
  });

  nextRoundGroups.forEach((group, index) => {
    const y = 494 + index * 222;
    ctx.fillStyle = index % 2 === 0 ? 'rgba(255,250,242,0.96)' : 'rgba(239,230,216,0.96)';
    ctx.fillRect(86, y, width - 172, 176);
    ctx.fillStyle = '#172117';
    ctx.font = `700 24px ${fontFamily}`;
    ctx.fillText(group.group, 122, y + 48);
    ctx.fillStyle = '#b9975b';
    ctx.font = `700 30px ${fontFamily}`;
    ctx.fillText(`${group.teeTime} 티업`, 760, y + 50);
    ctx.fillStyle = '#172117';
    ctx.font = `700 38px ${fontFamily}`;
    ctx.fillText(group.members.join('  ·  '), 122, y + 116);
  });

  ctx.fillStyle = 'rgba(255,250,242,0.10)';
  ctx.fillRect(86, 1194, width - 172, 82);
  ctx.fillStyle = 'rgba(255,250,242,0.72)';
  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillText('05:40 클하 집합 · 06:03 티업 시작 · 12:00 점심식사', 122, 1246);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.96);
  });
};

const drawRoundPosterCard = async () => {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const image = await loadCanvasImage('/images/golf-lifestyle-black-fairway.jpg');
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350;
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const ctx = context;
  ctx.scale(scale, scale);

  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = 0;
  let drawY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    drawX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    drawY = (height - drawHeight) / 2;
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  const leftShade = ctx.createLinearGradient(0, 0, width, 0);
  leftShade.addColorStop(0, 'rgba(15,16,19,0.86)');
  leftShade.addColorStop(0.42, 'rgba(15,16,19,0.58)');
  leftShade.addColorStop(0.74, 'rgba(15,16,19,0.08)');
  leftShade.addColorStop(1, 'rgba(15,16,19,0)');
  ctx.fillStyle = leftShade;
  ctx.fillRect(0, 0, width, height);

  const bottomShade = ctx.createLinearGradient(0, height * 0.56, 0, height);
  bottomShade.addColorStop(0, 'rgba(15,16,19,0)');
  bottomShade.addColorStop(1, 'rgba(15,16,19,0.68)');
  ctx.fillStyle = bottomShade;
  ctx.fillRect(0, 0, width, height);

  const fontFamily = '"Malgun Gothic", "Noto Sans KR", Arial, sans-serif';
  ctx.strokeStyle = 'rgba(216,192,140,0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 54, width - 108, height - 108);

  ctx.fillStyle = '#d9c08c';
  ctx.font = `700 26px ${fontFamily}`;
  ctx.fillText('DKU-RE09 PRIVATE GOLF CLUB', 86, 126);

  ctx.fillStyle = '#fbfaf7';
  ctx.font = `800 78px ${fontFamily}`;
  ctx.fillText(nextSchedule.title, 86, 246);

  ctx.fillStyle = 'rgba(251,250,247,0.84)';
  ctx.font = `700 32px ${fontFamily}`;
  ctx.fillText(nextSchedule.date, 86, 312);
  ctx.fillText(nextSchedule.location, 86, 360);

  ctx.fillStyle = 'rgba(251,250,247,0.88)';
  ctx.font = `700 28px ${fontFamily}`;
  ctx.fillText(`${nextRoundParticipants.length}명 참석 · ${nextRoundGroups.length}팀 편성`, 86, 436);

  ctx.fillStyle = 'rgba(109,31,42,0.88)';
  ctx.fillRect(86, 1118, 514, 84);
  ctx.fillStyle = '#fbfaf7';
  ctx.font = `800 32px ${fontFamily}`;
  ctx.fillText('05:40 클하 집합 · 06:03 첫 티업', 116, 1172);

  ctx.fillStyle = 'rgba(251,250,247,0.74)';
  ctx.font = `700 22px ${fontFamily}`;
  ctx.fillText('Generated round poster for Kakao share', 86, 1254);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.96);
  });
};

const RoundToolsSection: React.FC<RoundToolsSectionProps> = ({ onBack }) => {
  const [scoreRows, setScoreRows] = useState<ScoreRow[]>(getInitialRows);
  const [shareStatus, setShareStatus] = useState('이미지 준비 완료');
  const [posterStatus, setPosterStatus] = useState('포스터 준비 완료');

  const completedRows = useMemo(
    () =>
      scoreRows
        .map((row) => ({
          ...row,
          grossValue: parseNumber(row.gross),
          frontValue: parseNumber(row.front),
          backValue: parseNumber(row.back),
          handicapValue: parseNumber(row.handicap),
        }))
        .filter((row) => row.grossValue > 0),
    [scoreRows]
  );

  const awardCards = useMemo<AwardCard[]>(() => {
    if (!completedRows.length) {
      return [
        {
          label: 'Score required',
          name: '점수 입력 대기',
          value: '-',
          detail: '라운드 후 총타수를 입력하면 자동 시상이 열립니다.',
          tone: 'border-[#d6c5a8] bg-[#fffaf2] text-[#172117]',
        },
      ];
    }

    const byGross = [...completedRows].sort((a, b) => a.grossValue - b.grossValue)[0];
    const byNet = [...completedRows].sort((a, b) => a.grossValue - a.handicapValue - (b.grossValue - b.handicapValue))[0];
    const byFront = [...completedRows].filter((row) => row.frontValue > 0).sort((a, b) => a.frontValue - b.frontValue)[0];
    const byBack = [...completedRows].filter((row) => row.backValue > 0).sort((a, b) => a.backValue - b.backValue)[0];
    const effort = [...completedRows].sort((a, b) => b.grossValue - a.grossValue)[0];
    const improvements = completedRows
      .map((row) => {
        const previous = members.find((member) => member.name === row.name)?.scoreHistory[0] ?? 0;
        return { ...row, previous, improvedBy: previous > 0 ? previous - row.grossValue : -999 };
      })
      .filter((row) => row.previous > 0)
      .sort((a, b) => b.improvedBy - a.improvedBy);
    const improved = improvements[0];

    const teamResults = nextRoundGroups
      .map((group) => {
        const teamRows = group.members
          .map((name) => completedRows.find((row) => row.name === name))
          .filter(Boolean) as typeof completedRows;

        if (teamRows.length !== group.members.length) return null;
        const averageNet = teamRows.reduce((sum, row) => sum + row.grossValue - row.handicapValue, 0) / teamRows.length;
        return { group, averageNet };
      })
      .filter(Boolean)
      .sort((a, b) => a!.averageNet - b!.averageNet)[0];

    return [
      {
        label: 'Gross champion',
        name: byGross.name,
        value: `${byGross.grossValue}타`,
        detail: '순수 총타수 기준 우승',
        tone: 'border-[#b9975b]/35 bg-[#172117] text-[#fffaf2]',
      },
      {
        label: 'Net champion',
        name: byNet.name,
        value: `Net ${(byNet.grossValue - byNet.handicapValue).toFixed(1)}`,
        detail: `핸디 ${byNet.handicapValue || 0} 반영`,
        tone: 'border-[#d6c5a8] bg-[#fffaf2] text-[#172117]',
      },
      {
        label: 'Front nine',
        name: byFront?.name ?? '-',
        value: byFront ? `${byFront.frontValue}타` : '-',
        detail: byFront ? '전반 최저타' : '전반 점수 입력 필요',
        tone: 'border-[#d6c5a8] bg-[#efe6d8] text-[#172117]',
      },
      {
        label: 'Back nine',
        name: byBack?.name ?? '-',
        value: byBack ? `${byBack.backValue}타` : '-',
        detail: byBack ? '후반 최저타' : '후반 점수 입력 필요',
        tone: 'border-[#d6c5a8] bg-[#efe6d8] text-[#172117]',
      },
      {
        label: 'Improvement',
        name: improved?.name ?? '-',
        value: improved && improved.improvedBy > 0 ? `${improved.improvedBy}타 개선` : '-',
        detail: improved ? `직전 기록 ${improved.previous}타 대비` : '이전 기록 있는 멤버 필요',
        tone: 'border-[#d6c5a8] bg-[#fffaf2] text-[#172117]',
      },
      {
        label: 'Team best',
        name: teamResults?.group.group ?? '-',
        value: teamResults ? `Avg Net ${teamResults.averageNet.toFixed(1)}` : '-',
        detail: teamResults ? teamResults.group.members.join(' · ') : '팀 전원 총타수 입력 필요',
        tone: 'border-[#d6c5a8] bg-[#fffaf2] text-[#172117]',
      },
      {
        label: 'Spirit award',
        name: effort.name,
        value: `${effort.grossValue}타`,
        detail: '다음 라운드 반등 예약',
        tone: 'border-[#b9975b]/35 bg-[#172117] text-[#fffaf2]',
      },
    ];
  }, [completedRows]);

  const updateScoreRow = (index: number, field: keyof ScoreRow, value: string) => {
    setScoreRows((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  };

  const resetScores = () => {
    setScoreRows(getInitialRows());
  };

  const loadLatestRecord = () => {
    const latest = records[0];
    setScoreRows((prev) =>
      prev.map((row) => {
        const attendee = latest?.attendees.find((item) => item.name === row.name);
        if (!attendee) return row;

        return {
          ...row,
          gross: String(attendee.score),
          front: String(attendee.front),
          back: String(attendee.back),
        };
      })
    );
  };

  const downloadShareImage = async () => {
    const blob = await drawRoundShareCard();
    if (!blob) {
      setShareStatus('이미지 생성 실패');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DKU-RE09_2회_정기라운딩_조편성.png';
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus('PNG 저장 완료');
  };

  const copyShareImage = async () => {
    const blob = await drawRoundShareCard();
    if (!blob) {
      setShareStatus('이미지 생성 실패');
      return;
    }

    try {
      if ('ClipboardItem' in window && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setShareStatus('이미지 복사 완료');
        return;
      }
    } catch {
      setShareStatus('복사 미지원, PNG로 저장하세요');
      return;
    }

    setShareStatus('복사 미지원, PNG로 저장하세요');
  };

  const downloadPosterImage = async () => {
    try {
      const blob = await drawRoundPosterCard();
      if (!blob) {
        setPosterStatus('포스터 생성 실패');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DKU-RE09_round_poster.png';
      link.click();
      URL.revokeObjectURL(url);
      setPosterStatus('포스터 PNG 저장 완료');
    } catch {
      setPosterStatus('포스터 생성 실패');
    }
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

        <div className="grid gap-5 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="rounded-[2rem] border border-[#344433] bg-[#101810] p-5 text-[#fffaf2] shadow-[0_34px_90px_-70px_rgba(23,33,23,0.8)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8c39a]">Round tool suite</p>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8c39a]/25 bg-white/10 text-[#d8c39a]">
                <Sparkles size={18} />
              </span>
            </div>
            <h1 className="mt-4 break-keep font-serif text-3xl italic leading-tight sm:text-4xl">라운딩 시상·공유 툴</h1>
            <p className="mt-4 break-keep text-sm font-semibold leading-7 text-white/62">
              라운드가 끝나면 점수만 넣고 시상 결과를 뽑고, 시작 전에는 조편성 이미지를 저장해서 카톡방에 바로 올릴 수 있습니다.
            </p>

            <div className="mt-7 rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">이번 라운딩</p>
              <p className="mt-2 text-lg font-bold">{nextSchedule.location}</p>
              <p className="mt-1 text-sm font-semibold text-[#d8c39a]">{nextSchedule.date}</p>
              <div className="mt-4 space-y-2">
                {nextRoundPlan.map((plan) => (
                  <div key={`${plan.time}-${plan.label}`} className="flex items-center justify-between gap-3 rounded-xl bg-black/18 px-3 py-2">
                    <span className="text-xs font-bold text-white/58">{plan.label}</span>
                    <span className="text-sm font-bold text-[#fffaf2]">{plan.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-[#d8c39a]/24 bg-white/8">
              <div className="relative aspect-[4/5]">
                <img src="/images/golf-lifestyle-black-fairway.jpg" alt="Round poster preview" className="h-full w-full object-cover object-[52%_center]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,16,0.08)_0%,rgba(16,24,16,0.78)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <button
                    type="button"
                    onClick={downloadPosterImage}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fffaf2] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#172117] transition hover:bg-[#efe3d1]"
                  >
                    포스터 PNG 저장
                    <Download size={13} />
                  </button>
                  <p className="mt-2 text-xs font-semibold text-[#d8c39a]">{posterStatus}</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-5">
            <div className="rounded-[2rem] border border-[#d6c5a8] bg-[#fffaf2] p-5 shadow-[0_26px_80px_-70px_rgba(23,33,23,0.4)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#847765]">After round awards</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#172117]">자동 시상 데스크</h2>
                  <p className="mt-2 break-keep text-sm font-semibold leading-6 text-[#66785c]">
                    총타수만 입력해도 우승·Net 우승·분발상이 나오고, 전후반까지 넣으면 전반/후반상도 자동 계산됩니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadLatestRecord}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d6c5a8] bg-[#fbf7ef] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4c5d47] transition hover:bg-[#efe6d8]"
                  >
                    최근 기록 채우기
                    <Trophy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={resetScores}
                    className="inline-flex items-center gap-2 rounded-full bg-[#172117] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fffaf2] transition hover:bg-[#344433]"
                  >
                    초기화
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-[#d6c5a8] bg-[#fbf7ef] p-3">
                <div className="space-y-3 md:hidden">
                  {scoreRows.map((row, index) => (
                    <div key={`${row.name}-${index}-mobile`} className="rounded-[1.1rem] bg-[#fffaf2] p-3 shadow-[0_10px_28px_-26px_rgba(23,33,23,0.42)]">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d6c5a8] bg-[#fbf7ef] text-xs font-bold text-[#847765]">
                          {index + 1}
                        </span>
                        <span className="min-w-0 truncate text-base font-bold text-[#172117]">{row.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {scoreFields.map((field) => (
                          <label key={field.key} className="min-w-0 rounded-[0.95rem] border border-[#d6c5a8] bg-[#fbf7ef] px-3 py-2">
                            <span className="block text-[10px] font-bold tracking-[0.12em] text-[#847765]">{field.label}</span>
                            <input
                              value={row[field.key]}
                              onChange={(event) => updateScoreRow(index, field.key, event.target.value)}
                              inputMode="decimal"
                              aria-label={`${row.name} ${field.label}`}
                              className="mt-1 h-9 w-full rounded-lg bg-transparent text-center text-base font-bold text-[#172117] outline-none"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block">
                  <div className="grid grid-cols-[2.4rem_minmax(7rem,1.4fr)_repeat(4,minmax(4.8rem,1fr))] gap-2 px-2 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#847765]">
                    <span>No</span>
                    <span>멤버</span>
                    {scoreFields.map((field) => (
                      <span key={field.key}>{field.label}</span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {scoreRows.map((row, index) => (
                      <div
                        key={`${row.name}-${index}`}
                        className="grid grid-cols-[2.4rem_minmax(7rem,1.4fr)_repeat(4,minmax(4.8rem,1fr))] items-center gap-2 rounded-[1rem] bg-[#fffaf2] px-2 py-2"
                      >
                        <span className="text-center text-xs font-bold text-[#847765]">{index + 1}</span>
                        <span className="min-w-0 truncate text-sm font-bold text-[#172117]">{row.name}</span>
                        {scoreFields.map((field) => (
                          <input
                            key={field.key}
                            value={row[field.key]}
                            onChange={(event) => updateScoreRow(index, field.key, event.target.value)}
                            inputMode="decimal"
                            aria-label={`${row.name} ${field.label}`}
                            className="h-10 rounded-xl border border-[#d6c5a8] bg-[#fbf7ef] text-center text-sm font-bold text-[#172117] outline-none transition focus:border-[#b9975b]"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {awardCards.map((award) => (
                  <div key={`${award.label}-${award.name}`} className={`rounded-[1.35rem] border p-4 ${award.tone}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] opacity-55">{award.label}</p>
                      <Award size={16} className="opacity-70" />
                    </div>
                    <p className="mt-4 truncate text-xl font-bold">{award.name}</p>
                    <p className="mt-1 text-sm font-bold text-[#b9975b]">{award.value}</p>
                    <p className="mt-2 break-keep text-xs font-semibold leading-5 opacity-65">{award.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-[#344433] bg-[#172117] p-5 text-[#fffaf2] shadow-[0_30px_90px_-72px_rgba(23,33,23,0.75)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">조편성 이미지</h2>
                  </div>
                  <Image size={22} className="text-[#d8c39a]" />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadShareImage}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fffaf2] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#172117] transition hover:bg-[#efe3d1]"
                  >
                    PNG 저장
                    <Download size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={copyShareImage}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8c39a]/28 bg-white/10 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fffaf2] transition hover:border-[#d8c39a]/55 hover:bg-white/18"
                  >
                    이미지 복사
                    <Copy size={14} />
                  </button>
                </div>
                <p className="mt-4 text-xs font-semibold text-[#d8c39a]">{shareStatus}</p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#d6c5a8] bg-[#fffaf2] p-4">
                <div className="rounded-[1.5rem] bg-[#101810] p-5 text-[#fffaf2]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d8c39a]">DKU-RE09</p>
                      <h3 className="mt-2 break-keep text-2xl font-bold">2회 정기 라운딩 조편성</h3>
                      <p className="mt-1 text-xs font-semibold text-white/58">{nextSchedule.location} · {nextSchedule.date}</p>
                    </div>
                    <Users size={18} className="text-[#d8c39a]" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {nextRoundGroups.map((group) => (
                      <div key={group.group} className="rounded-[1.1rem] bg-[#fffaf2] p-3 text-[#172117]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#847765]">{group.group}</p>
                          <p className="text-xs font-bold text-[#b9975b]">{group.teeTime} 티업</p>
                        </div>
                        <p className="mt-2 break-keep text-sm font-bold leading-6">{group.members.join(' · ')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[1rem] border border-white/10 bg-white/10 px-3 py-3 text-xs font-bold text-white/72">
                    05:40 클하 집합 · 06:03 티업 시작 · 12:00 천년소나무
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoundToolsSection;
