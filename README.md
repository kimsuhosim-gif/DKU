# DKU RE09 Golf Club

Vite + React + TypeScript 기반 프로젝트입니다.

## Run Locally

Prerequisites: Node.js 20+

1. Install dependencies:
   `npm install`
2. Create `.env.local` from `.env.example`
3. Fill in the required keys
4. Run the dev server:
   `npm run dev`

## Environment Variables

- `VITE_OPENWEATHER_API_KEY`: OpenWeather API key
- `VITE_NAVER_MAP_CLIENT_ID`: Naver Maps client ID
- `VITE_NAVER_MAP_SCRIPT_URL`: Naver Maps script URL

Example script URL:

`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_CLIENT_ID`

## RE09 Driver Club

`#/game`에서 플레이합니다. 목표 건물을 선택한 뒤 공을 아래로 당겼다가 놓아 발사합니다. 좌우 드래그로 방향을 바꾸며 추천 샷 버튼 또는 Space도 사용할 수 있습니다. 정밀 슬라이더는 접이식 설정에 있습니다. 공 추적 카메라와 효과음은 상단에서 전환합니다.

- 투어볼은 무제한이며 폭발구·관통구·멀티샷·메테오·전격구는 보급 수량을 소비합니다.
- 명중과 철거로 얻은 게임 코인으로 아이템을 구입합니다. 현금 결제는 없습니다.
- 구역 3개, 약점·장갑·횡풍·별 평가를 지원합니다. 진행은 새로고침 시 초기화되고 최고점만 `re09-driver-best-v1`에 저장합니다.
- `npm run test:drive`: 고속 충돌·평행/접선 충돌·횡풍 조준 회귀 검사.
- `npm run typecheck`와 `npm run build`로 타입과 프로덕션 빌드를 확인합니다.

일반구는 가까운 건물로 한 번 도탄합니다. 외벽은 명중 위치부터 파손되고, 철거 시 층별로 무너지는 잔해와 주변 건물에 대한 연쇄 피해가 발생합니다.

