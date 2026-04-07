import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#dfd5c8] bg-[#f7f1e8] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">DKU-RE09 Golf Club</p>
          <h2 className="mt-4 font-serif text-3xl italic leading-[1.05] tracking-[-0.03em] text-[#2b382c] sm:text-4xl">
            라운드의 긴장감과
            <br />
            동기들만의 분위기를 조용히 쌓아두는 공간.
          </h2>
        </div>
        <div>
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Since</p>
            <p className="mt-3 font-serif text-2xl italic text-[#2b382c]">2009</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              단국대학교 도시계획부동산학부 09학번 멤버들이 라운드와 저녁 자리를 이어가며 함께 기록을 남기는 프라이빗 클럽입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-[#e6ddd2] pt-6 text-[10px] uppercase tracking-[0.22em] text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© 2009 DKU-RE09 Golf Club</span>
        <span>Members only club archive</span>
      </div>
    </footer>
  );
};

export default Footer;
