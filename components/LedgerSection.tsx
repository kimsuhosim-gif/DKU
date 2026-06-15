import React from 'react';
import { ArrowLeft, Download, Landmark, ReceiptText } from 'lucide-react';
import { ACCOUNT_HOLDER, ACCOUNT_NUMBER, clubExpenseItems2026Q2, clubFinanceSummary, membershipDues2026 } from '../utils/golfData';

interface LedgerSectionProps {
  onBack: () => void;
}

const formatAmount = (amount: number) => (amount === 0 ? '-' : `₩${amount.toLocaleString()}`);
const formatPlainAmount = (amount: number) => `₩${amount.toLocaleString()}`;

const LedgerSection: React.FC<LedgerSectionProps> = ({ onBack }) => {
  const totals = membershipDues2026.reduce(
    (acc, row) => ({
      annualDues: acc.annualDues + row.annualDues,
      entranceFee: acc.entranceFee + row.entranceFee,
      billedAmount: acc.billedAmount + row.billedAmount,
      paidAmount: acc.paidAmount + row.paidAmount,
      unpaidAmount: acc.unpaidAmount + row.unpaidAmount,
    }),
    { annualDues: 0, entranceFee: 0, billedAmount: 0, paidAmount: 0, unpaidAmount: 0 }
  );

  const roundExpense = clubExpenseItems2026Q2.reduce((sum, item) => sum + item.amount, 0);
  const expectedExpense = roundExpense + clubFinanceSummary.expectedSecondHalfExpense2026;
  const expectedYearEndBalance = clubFinanceSummary.totalBudget2026 - expectedExpense;

  const summaryCards = [
    { label: '납부액(이월포함)', value: formatPlainAmount(clubFinanceSummary.cashBeforeRoundExpense2026), tone: 'bg-white text-[#172117]' },
    { label: '26년 미납액', value: formatPlainAmount(totals.unpaidAmount), tone: 'bg-[#f3e5df] text-[#6d1f2a]' },
    { label: '이번 지출', value: formatPlainAmount(roundExpense), tone: 'bg-[#fff7df] text-[#6f512a]' },
    { label: '결산 잔액', value: formatPlainAmount(clubFinanceSummary.currentCash), tone: 'bg-[#172117] text-[#fffaf2]' },
    { label: '회원수', value: `${clubFinanceSummary.memberCount}명`, tone: 'bg-white text-[#172117]' },
    { label: '하반기 예상지출', value: formatPlainAmount(clubFinanceSummary.expectedSecondHalfExpense2026), tone: 'bg-white text-[#172117]' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6f7668] transition-colors hover:text-[#243321] sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#6f7668] sm:text-xs">2026 Q2 1회 회비 결산내역</span>
          <h2 className="mt-3 font-serif text-3xl text-[#243321] sm:text-5xl">회비 장부</h2>
          <p className="mt-3 max-w-2xl break-keep text-sm font-semibold leading-6 text-[#686b62]">
            2026년 연회비 납부액, 미납액, 이번 라운딩 사용 비용과 결산 잔액을 정리했습니다.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[#cdb786]/38 bg-white/70 p-4 text-left shadow-[0_18px_44px_-38px_rgba(23,33,23,0.42)] md:text-right">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#847765]">회비 계좌</p>
          <p className="text-sm font-bold text-[#172117]">카카오뱅크 {ACCOUNT_NUMBER}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#686b62]">예금주 {ACCOUNT_HOLDER}</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-[1.1rem] border border-[#d6c5a8] p-4 shadow-[0_16px_42px_-38px_rgba(23,33,23,0.45)] ${card.tone}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] opacity-60">{card.label}</p>
            <p className="mt-2 break-keep text-lg font-bold leading-6">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-7 grid gap-3 rounded-[1.4rem] border border-[#d6c5a8] bg-[#fffaf2]/80 p-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['인당 회비', formatPlainAmount(clubFinanceSummary.perMemberDues)],
          ['입회비', formatPlainAmount(clubFinanceSummary.newMemberFee)],
          ['신규회원수', `${clubFinanceSummary.newMemberCount}명`],
          ['25년 이월회비', formatPlainAmount(clubFinanceSummary.carriedBalance2025)],
          ['26년 납부액', formatPlainAmount(totals.paidAmount)],
          ['예상 연말잔액', formatPlainAmount(expectedYearEndBalance)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[0.95rem] bg-white/72 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#847765]">{label}</p>
            <p className="mt-1.5 text-sm font-bold text-[#172117]">{value}</p>
          </div>
        ))}
      </div>

      <section className="mb-7 rounded-[1.4rem] border border-[#d6c5a8] bg-white/86 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#847765]">Round expense</p>
            <h3 className="mt-2 text-xl font-bold text-[#172117]">이번 라운딩 사용 비용</h3>
          </div>
          <p className="rounded-full bg-[#172117] px-4 py-2 text-sm font-bold text-[#fffaf2]">
            총 {formatPlainAmount(roundExpense)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {clubExpenseItems2026Q2.map((item) => (
            <div key={item.no} className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#d6c5a8] bg-[#fbf7ef] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6d1f2a]">
                  <ReceiptText size={17} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#172117]">{item.title}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#686b62]">{item.note}</p>
                </div>
              </div>
              <p className="shrink-0 font-mono text-sm font-bold text-[#172117]">{formatPlainAmount(item.amount)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-3 md:hidden">
        {membershipDues2026.map((row) => (
          <div key={row.no} className="rounded-[1.25rem] border border-[#d6c5a8] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[#847765]">NO. {row.no}</p>
                <p className="mt-1 text-lg font-bold text-[#172117]">{row.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${row.type === '신규' ? 'bg-[#fff2b8] text-[#6f512a]' : 'bg-[#e8ebe2] text-[#34462f]'}`}>
                {row.type}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['회비', formatAmount(row.annualDues)],
                ['입회비', formatAmount(row.entranceFee)],
                ['청구액', formatAmount(row.billedAmount)],
                ['납부액', formatAmount(row.paidAmount)],
                ['미납액', formatAmount(row.unpaidAmount)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[0.9rem] bg-[#fbf7ef] p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#847765]">{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#172117]">{value}</p>
                </div>
              ))}
            </div>
            {row.note ? <p className="mt-3 rounded-[0.85rem] bg-[#f3e5df] px-3 py-2 text-xs font-semibold text-[#6d1f2a]">{row.note}</p> : null}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-[1.6rem] border border-[#d6c5a8] bg-white shadow-sm md:block">
        <table className="min-w-[980px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#243a54] text-white">
              {['No', '회원명', '구분', '회비', '입회비', '청구액', '납부액', '미납액', '입금일 / 비고'].map((header) => (
                <th key={header} className="px-4 py-3 text-center text-[11px] font-bold tracking-[0.08em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {membershipDues2026.map((row) => (
              <tr key={row.no} className={`border-b border-[#d6c5a8]/52 ${row.type === '신규' ? 'bg-[#e7f0dd]/70' : 'bg-white'}`}>
                <td className="px-3 py-2 text-center text-xs font-semibold text-[#172117]">{row.no}</td>
                <td className="px-3 py-2 text-center text-sm font-bold text-[#172117]">{row.name}</td>
                <td className="px-3 py-2 text-center text-xs font-semibold text-[#172117]">{row.type}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-[#172117]">{formatAmount(row.annualDues)}</td>
                <td className={`px-3 py-2 text-right font-mono text-xs ${row.entranceFee > 0 ? 'bg-yellow-200 font-bold text-[#172117]' : 'text-[#172117]'}`}>
                  {formatAmount(row.entranceFee)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs text-[#172117]">{formatAmount(row.billedAmount)}</td>
                <td className={`px-3 py-2 text-right font-mono text-xs font-bold ${row.paidAmount > 0 ? 'bg-[#b8ccec] text-[#172117]' : 'text-[#172117]'}`}>
                  {formatAmount(row.paidAmount)}
                </td>
                <td className={`px-3 py-2 text-right font-mono text-xs font-bold ${row.unpaidAmount > 0 ? 'bg-[#dceccd] text-[#172117]' : 'text-[#172117]'}`}>
                  {formatAmount(row.unpaidAmount)}
                </td>
                <td className="px-3 py-2 text-xs font-semibold text-[#6d1f2a]">{row.note ?? ''}</td>
              </tr>
            ))}
            <tr className="bg-[#f6c8a8] font-bold text-[#172117]">
              <td colSpan={3} className="px-3 py-3 text-center text-xs">
                합계
              </td>
              <td className="px-3 py-3 text-right font-mono text-xs">{formatAmount(totals.annualDues)}</td>
              <td className="px-3 py-3 text-right font-mono text-xs">{formatAmount(totals.entranceFee)}</td>
              <td className="px-3 py-3 text-right font-mono text-xs">{formatAmount(totals.billedAmount)}</td>
              <td className="px-3 py-3 text-right font-mono text-xs">{formatAmount(totals.paidAmount)}</td>
              <td className="px-3 py-3 text-right font-mono text-xs">{formatAmount(totals.unpaidAmount)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[1.4rem] border border-[#d6c5a8] bg-[#fffaf2] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172117] text-[#fffaf2]">
            <Landmark size={18} />
          </span>
          <p className="break-keep text-xs font-semibold leading-6 text-[#686b62]">
            기준: 2026년부터 월 회비 10,000원 x 12개월 = 연 120,000원 일괄 납부. 신규회원은 입회비 50,000원 추가.
          </p>
        </div>
        <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#172117] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fffaf2] transition hover:bg-[#344433]">
          <Download size={14} />
          내역서
        </button>
      </div>
    </div>
  );
};

export default LedgerSection;
