import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#dfd5c8] bg-[#f7f1e8] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">DKU-RE09 Golf Club</p>
          <h2 className="mt-4 font-serif text-3xl italic text-[#2b382c] sm:text-4xl">A private archive for rounds, records, and rivalry.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Established</p>
            <p className="mt-3 font-serif text-2xl italic text-[#2b382c]">Since 2009</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">단국대 도시계획부동산학부 09학번 골프 클럽의 멤버 전용 기록 공간입니다.</p>
          </div>
          <div className="rounded-[2rem] bg-[#2b382c] p-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Signature</p>
            <p className="mt-3 font-serif text-2xl italic">Quietly competitive</p>
            <p className="mt-3 text-sm leading-7 text-white/65">운영 정보보다 분위기와 기록의 축적이 먼저 느껴지는 홈페이지를 목표로 정리했습니다.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-[#e6ddd2] pt-6 text-[10px] uppercase tracking-[0.28em] text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© 2009 DKU-RE09 Golf Club</span>
        <span>Members only archive</span>
      </div>
    </footer>
  );
};

export default Footer;
