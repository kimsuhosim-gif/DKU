export const views = ['home','rounds','records','ledger','more','members','weather','map','ranking','gallery','bets','tools','game'] as const;
export type ViewState = typeof views[number];
export const primaryNavigation: {label:string;view:ViewState}[] = [{label:'홈',view:'home'},{label:'라운드',view:'rounds'},{label:'랭킹',view:'ranking'},{label:'회비',view:'ledger'},{label:'더보기',view:'more'}];
export function activeNavigation(view: ViewState): ViewState {
 if (view==='records') return 'rounds';
 if (view==='gallery') return 'more';
 if (['weather','map','tools'].includes(view)) return 'rounds';
 if (['members','bets','game'].includes(view)) return 'more';
 return view;
}
export function readView(hash = window.location.hash): ViewState {
 const value=hash.slice(2).split('?')[0];
 if(value==='records') return 'rounds';
 return views.includes(value as ViewState) ? value as ViewState : 'home';
}
export function isUpcoming(value:string) {
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return value.slice(0,10).replaceAll('.','-')>=today;
}
