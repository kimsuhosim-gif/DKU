
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, ArrowLeft } from 'lucide-react';

interface LedgerSectionProps {
  onBack: () => void;
}

const LedgerSection: React.FC<LedgerSectionProps> = ({ onBack }) => {
  const transactions = [
    { date: '2025.11.29', desc: '제1회 라운딩 회비 납부', amount: 1600000, type: 'income' },
    { date: '2025.11.29', desc: '골프존 상품권 지출', amount: -300000, type: 'expense' },
    { date: '2025.11.29', desc: '현수막 제작', amount: -15000, type: 'expense' },
    { date: '2025.11.29', desc: '스티커 제작', amount: -33000, type: 'expense' },
    { date: '2025.11.29', desc: '저녁 1차 (판교돈)', amount: -580000, type: 'expense' },
    { date: '2025.11.29', desc: '저녁 2차 (본술)', amount: -134000, type: 'expense' },
    { date: '2025.11.29', desc: '편의점 지출', amount: -27500, type: 'expense' },
  ];

  const currentBalance = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Transparency</span>
          <h2 className="text-5xl font-serif mt-4 text-sage-600">Fee Ledger</h2>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sage-300 font-bold mb-1">Membership Fee Account</p>
            <p className="text-sm font-serif text-sage-600">카카오뱅크 <span className="font-sans font-bold ml-2">3333-16-4428815</span></p>
            <p className="text-[11px] text-sage-400 mt-0.5">(예금주: 양창운)</p>
          </div>
          <div className="flex space-x-3">
            <button className="p-3 rounded-full border border-sage-100 text-sage-400 hover:bg-sage-50 transition-colors">
              <Filter size={18} />
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 rounded-full bg-sage-600 text-white text-xs uppercase tracking-widest hover:bg-sage-500 transition-colors">
              <Download size={14} />
              <span>Statement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-champagne-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-champagne-50/50">
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-sage-400 font-medium">Date</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-sage-400 font-medium">Description</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-sage-400 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne-50">
            {transactions.map((t, idx) => (
              <tr key={idx} className="hover:bg-champagne-50/30 transition-colors">
                <td className="px-8 py-6 text-sm text-sage-400">{t.date}</td>
                <td className="px-8 py-6 text-sm font-medium text-sage-600">{t.desc}</td>
                <td className={`px-8 py-6 text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-600' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'} ₩{Math.abs(t.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="p-8 bg-sage-50 rounded-[2rem] min-w-[300px]">
          <p className="text-xs uppercase tracking-widest text-sage-400">Current Balance</p>
          <p className="text-3xl font-serif text-sage-600 mt-2 italic font-bold">₩{currentBalance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LedgerSection;
