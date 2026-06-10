import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#16171b]/8 bg-[#eceff0] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6d1f2a]">DKU-RE09 Golf Club</p>
          <h2 className="mt-4 font-serif text-3xl italic leading-[1.05] tracking-normal text-[#16171b] sm:text-4xl">
            라운드의 기록과
            <br />
            멤버들의 순간을 단정하게 보관하는 곳.
          </h2>
        </div>
        <div>
          <div className="rounded-[1.1rem] border border-[#c8a86b]/26 bg-white/62 p-6 shadow-[0_24px_72px_-58px_rgba(22,23,27,0.36)] backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6e665a]">Since</p>
            <p className="mt-3 font-serif text-2xl italic text-[#6d1f2a]">2009</p>
            <p className="mt-3 break-keep text-sm leading-7 text-[#4f4b47]">
              단국대 09 멤버들의 라운드, 회비, 일정, 사진을 모아두는 프라이빗 클럽 아카이브입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-[#16171b]/8 pt-6 text-[10px] uppercase tracking-[0.22em] text-[#6e665a] md:flex-row md:items-center md:justify-between">
        <span>© 2009 DKU-RE09 Golf Club</span>
        <span>Members only club archive</span>
      </div>
    </footer>
  );
};

export default Footer;
