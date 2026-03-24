import React from 'react';
import { Download, Filter, ArrowLeft } from 'lucide-react';

interface LedgerSectionProps {
  onBack: () => void;
}

const LedgerSection: React.FC<LedgerSectionProps> = ({ onBack }) => {
  const transactions = [
    { date: '2025.11.29', desc: 'Quarter dues collected', amount: 1600000, type: 'income' },
    { date: '2025.11.29', desc: 'Golf shop gift vouchers', amount: -300000, type: 'expense' },
    { date: '2025.11.29', desc: 'Water and refreshments', amount: -15000, type: 'expense' },
    { date: '2025.11.29', desc: 'Name sticker printing', amount: -33000, type: 'expense' },
    { date: '2025.11.29', desc: 'Dinner after round', amount: -580000, type: 'expense' },
    { date: '2025.11.29', desc: 'Second venue drinks', amount: -134000, type: 'expense' },
    { date: '2025.11.29', desc: 'Prize packaging', amount: -27500, type: 'expense' },
  ] as const;

  const currentBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const formatAmount = (amount: number) => `₩${Math.abs(amount).toLocaleString()}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between lg:mb-16">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">Transparency</span>
          <h2 className="mt-3 font-serif text-3xl text-sage-600 sm:text-5xl">Fee Ledger</h2>
        </div>

        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:items-end">
          <div className="w-full text-left md:text-right">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sage-300">Membership Fee Account</p>
            <p className="text-sm text-sage-600">
              KakaoBank<span className="ml-2 font-bold">3333-16-4428815</span>
            </p>
            <p className="mt-0.5 text-[11px] text-sage-400">Account holder: Club Secretary</p>
          </div>

          <div className="flex w-full gap-3 overflow-x-auto pb-1 md:w-auto md:pb-0">
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage-100 text-sage-400 transition-colors hover:bg-sage-50">
              <Filter size={18} />
            </button>
            <button className="flex shrink-0 items-center space-x-2 whitespace-nowrap rounded-full bg-sage-600 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-sage-500">
              <Download size={14} />
              <span>Statement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:hidden">
        <div className="rounded-2xl bg-sage-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-300">Transactions</p>
          <p className="mt-2 text-2xl font-serif text-sage-600">{transactions.length}</p>
        </div>
        <div className="rounded-2xl bg-sage-600 p-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Balance</p>
          <p className="mt-2 text-xl font-serif">{formatAmount(currentBalance)}</p>
        </div>
      </div>

      <div className="space-y-4 sm:hidden">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex flex-col space-y-3 rounded-2xl border border-champagne-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-300">{t.date}</span>
              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'} {formatAmount(t.amount)}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug text-sage-600">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-[2.5rem] border border-champagne-100 bg-white shadow-sm sm:block">
        <table className="min-w-[500px] w-full border-collapse text-left sm:min-w-full">
          <thead>
            <tr className="bg-champagne-50/50">
              <th className="px-8 py-6 text-[10px] font-medium uppercase tracking-widest text-sage-400">Date</th>
              <th className="px-8 py-6 text-[10px] font-medium uppercase tracking-widest text-sage-400">Description</th>
              <th className="px-8 py-6 text-right text-[10px] font-medium uppercase tracking-widest text-sage-400">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne-50">
            {transactions.map((t, idx) => (
              <tr key={idx} className="transition-colors hover:bg-champagne-50/30">
                <td className="whitespace-nowrap px-8 py-6 text-sm text-sage-400">{t.date}</td>
                <td className="min-w-[150px] px-8 py-6 text-sm font-medium text-sage-600">{t.desc}</td>
                <td className={`whitespace-nowrap px-8 py-6 text-right text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatAmount(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full rounded-[1.5rem] bg-sage-50 p-6 text-right sm:w-auto sm:min-w-[300px] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-widest text-sage-400 sm:text-xs">Current Balance</p>
          <p className="mt-2 font-serif text-2xl font-bold italic text-sage-600 sm:text-3xl">{formatAmount(currentBalance)}</p>
        </div>
      </div>
    </div>
  );
};

export default LedgerSection;
