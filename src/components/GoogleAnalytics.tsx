/**
 * deerlink.kr 전용 GA4 속성("디어링크")의 측정 ID. 측정 ID는 페이지 HTML에 그대로 실리는 공개값이다.
 * 2026-09까지는 두구팝(dugupop.com)과 한 속성("데이터수집")에 스트림만 나눠 들어가 있었다.
 * 보고서가 섞이고 나중에 AdSense 연결도 속성 단위라 사이트별 속성으로 분리했다. 그 이전 데이터는 옛 속성에 남아 있다.
 */
export const GA_MEASUREMENT_ID = "G-DBPXPWTRL1";

/**
 * GA4 gtag.js 태그. 루트 레이아웃의 <head>에서 렌더된다.
 * 향상된 측정이 켜져 있어 클라이언트 라우팅도 page_view로 잡히니,
 * 라우트 변경마다 따로 이벤트를 쏘지 않는다.
 *
 * `next dev`에서는 렌더하지 않는다 — 로컬 개발 트래픽이 속성에 섞이면 안 된다.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        id={`gtag-init-${GA_MEASUREMENT_ID}`}
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
        }}
      />
    </>
  );
}
