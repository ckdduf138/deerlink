/** deerlink.kr 웹 스트림의 GA4 측정 ID. 측정 ID는 페이지 HTML에 그대로 실리는 공개값이다. */
export const GA_MEASUREMENT_ID = "G-CHXFFWN2KF";

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
