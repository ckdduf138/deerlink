#!/usr/bin/env node
/**
 * IndexNow로 색인을 요청한다 (네이버·빙·얀덱스가 같이 쓰는 규격, 구글은 미지원).
 * 보낼 주소는 사이트맵에서 읽는다 - 색인 대상 목록은 sitemap.ts 하나가 단일 출처다.
 *
 *   node scripts/indexnow.mjs            # 사이트맵 전체
 *   node scripts/indexnow.mjs /popular   # 특정 경로만
 *
 * 키 파일(public/<key>.txt)이 배포돼 있어야 한다. 검증에 실패하면 403이 온다.
 */
const HOST = "deerlink.kr";
const KEY = "0f3cd7a6589142e5bfa92064333f35e4";

const only = process.argv.slice(2);

const xml = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urlList = only.length
  ? all.filter((u) => only.some((prefix) => new URL(u).pathname.startsWith(prefix)))
  : all;

if (urlList.length === 0) {
  console.error("보낼 주소가 없어요");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`${res.status} ${res.statusText} - ${urlList.length}개 제출`);
if (!res.ok) console.log(await res.text());
