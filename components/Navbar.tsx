import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { activeNavigation, primaryNavigation, ViewState } from '../utils/clubNavigation';
export default function Navbar({currentView}:{currentView:ViewState}) {
 return <header className="club-header"><div className="club-container header-inner">
 <a href="#/home" className="club-brand" aria-label="DKU RE09 홈"><img className="re09-header-logo" src="/images/re09-premium-mark.png" alt="RE09" width="100" height="76"/></a>
 <nav aria-label="주 메뉴" className="desktop-navigation">{primaryNavigation.map(item=><a href={'#/'+item.view} key={item.view} aria-current={activeNavigation(currentView)===item.view?'page':undefined}>{item.label}</a>)}</nav>
 <a className="header-members" href="#/members">우리 멤버 <ArrowUpRight size={16}/></a>
 </div></header>;
}
