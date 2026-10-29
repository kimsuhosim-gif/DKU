import React from 'react';
import { House,Flag,BookOpen,Wallet,Grid2X2 } from 'lucide-react';
import { activeNavigation,primaryNavigation,ViewState } from '../utils/clubNavigation';
const icons=[House,Flag,BookOpen,Wallet,Grid2X2];
export default function MobileDock({currentView}:{currentView:ViewState}) {
 return <nav className="mobile-navigation" aria-label="모바일 주 메뉴">{primaryNavigation.map((item,index)=>{const Icon=icons[index];return <a key={item.view} href={'#/'+item.view} aria-current={activeNavigation(currentView)===item.view?'page':undefined}><Icon size={21}/><span>{item.label}</span></a>;})}</nav>;
}
