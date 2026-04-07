import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#dfd5c8] bg-[#f7f1e8] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">DKU-RE09 Golf Club</p>
          <h2 className="mt-4 font-serif text-3xl italic leading-[1.05] tracking-[-0.03em] text-[#2b382c] sm:text-4xl">
            라운드와 기록, 그리고 멤버의 흐름을
            <br />
            조용히 쌓아두는 아카이브.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Established</p>
            <p className="mt-3 font-serif text-2xl italic text-[#2b382c]">Since 2009</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              단국대학교 도시계획부동산학부 09학번 골프 클럽 멤버를 위한 기록 공간입니다.
            </p>
          </div>
          <div className="rounded-[2rem] bg-[#2b382c] p-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Signature</p>
            <p className="mt-3 font-serif text-2xl italic">Quietly competitive</p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              과한 장식보다 기록과 흐름이 먼저 보이도록, 멤버 중심의 홈 화면으로 정리한 버전입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-[#e6ddd2] pt-6 text-[10px] uppercase tracking-[0.22em] text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© 2009 DKU-RE09 Golf Club</span>
        <span>Members only archive</span>
      </div>
    </footer>
  );
};

export default Footer;
