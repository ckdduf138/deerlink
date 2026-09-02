import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { randomUUID } from "node:crypto";

const projectRoot = join(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

let baseUrl = "";
let serverProcess;
let databaseDirectory = "";
let serverLogs = "";

async function availablePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;
      probe.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (serverProcess?.exitCode !== null) {
      throw new Error(`Next.js server stopped before it was ready.\n${serverLogs}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The development server has not opened its port yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Next.js server did not become ready.\n${serverLogs}`);
}

async function importTypeScriptModule(relativePath) {
  const source = await readFile(join(projectRoot, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(dataUrl);
}

async function createRoom({ isPublic, title, questions }) {
  const response = await fetch(`${baseUrl}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublic, title, questions }),
  });
  await assertResponseStatus(response, 200);
  return response.json();
}

async function assertResponseStatus(response, expected) {
  if (response.status === expected) return;
  const body = await response.text();
  assert.fail(`expected HTTP ${expected}, received ${response.status}: ${body}`);
}

function answersFor(room, variant = 0) {
  return room.questions.map((question) => {
    if (question.type === "balance") {
      return { questionId: question.id, value: variant % 2 === 0 ? "A" : "B" };
    }
    if (question.type === "multiple") {
      return { questionId: question.id, value: String(variant % 2) };
    }
    return { questionId: question.id, value: "답".repeat(250) };
  });
}

async function submitAnswers({ room, submissionId, nickname, answers, cookie }) {
  return fetch(`${baseUrl}/api/rooms/${room.id}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify({ nickname, submissionId, answers }),
  });
}

function responseCookie(response) {
  const setCookie = response.headers.get("set-cookie");
  assert.ok(setCookie, "answer response must set the participant cookie");
  return setCookie.split(";", 1)[0];
}

async function assertPng(response) {
  await assertResponseStatus(response, 200);
  assert.match(response.headers.get("content-type") ?? "", /^image\/png\b/);
  const png = Buffer.from(await response.arrayBuffer());
  assert.ok(png.length > 1_000, "PNG must not be empty");
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1080);
  assert.equal(png.readUInt32BE(20), 1080);
  return png;
}

before(async () => {
  const envLocal = await readFile(join(projectRoot, ".env.local"), "utf8");
  assert.match(envLocal, /^TURSO_DATABASE_URL=["']?file:/m);
  assert.match(envLocal, /^DATABASE_URL=["']?file:/m);

  databaseDirectory = await mkdtemp(join(tmpdir(), "deerlink-regression-"));
  const databaseUrl = `file:${join(databaseDirectory, "qa.db")}`;
  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    TURSO_DATABASE_URL: databaseUrl,
    TURSO_AUTH_TOKEN: "",
    NEXT_TELEMETRY_DISABLED: "1",
  };

  await copyFile(join(projectRoot, "dev.db"), join(databaseDirectory, "qa.db"));

  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverProcess = spawn("yarn", ["dev", "--webpack", "-p", String(port)], {
    cwd: projectRoot,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const collectLog = (chunk) => {
    serverLogs = `${serverLogs}${chunk}`.slice(-20_000);
  };
  serverProcess.stdout.on("data", collectLog);
  serverProcess.stderr.on("data", collectLog);
  await waitForServer();
}, { timeout: 90_000 });

after(async () => {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => serverProcess.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ]);
  }
  if (databaseDirectory) {
    await rm(databaseDirectory, { recursive: true, force: true });
  }
});

test("participant URLs never carry creator state", async () => {
  const { participantPath, participantUrl } = await importTypeScriptModule("src/lib/room-url.ts");
  assert.equal(participantPath("room id"), "/room/room%20id");
  const url = new URL(participantUrl("https://deerlink.test/share?new=1", "abc"));
  assert.equal(url.toString(), "https://deerlink.test/room/abc");
  assert.equal(url.search, "");
});

test("draft answers and submission ID survive a reload-shaped round trip", async () => {
  const storage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };
  try {
    const drafts = await importTypeScriptModule("src/lib/draft-storage.ts");
    const key = drafts.answerDraftKey("reload-room");
    const expected = {
      nickname: "다시시도",
      answers: { q1: "A", q2: "긴 답변" },
      currentQuestion: 1,
      submissionId: randomUUID(),
    };
    drafts.saveDraft(key, expected);
    assert.deepEqual(drafts.parseDraft(drafts.draftSnapshot(key)), expected);
  } finally {
    delete globalThis.window;
  }
});

test("private flow keeps results locked, retries idempotently, and renders a full PNG", async () => {
  const room = await createRoom({
    isPublic: false,
    title: "가".repeat(50),
    questions: [
      {
        type: "balance",
        title: "서로의 선택을 비교하는 아주 긴 질문".repeat(5).slice(0, 80),
        optionA: "첫 번째 아주 긴 선택지".repeat(3).slice(0, 30),
        optionB: "두 번째 아주 긴 선택지".repeat(3).slice(0, 30),
      },
      {
        type: "multiple",
        title: "여러 선택지 가운데 마음이 가는 것을 묻는 질문".repeat(4).slice(0, 80),
        options: [
          "첫 번째 객관식 선택지".repeat(3).slice(0, 30),
          "두 번째 객관식 선택지".repeat(3).slice(0, 30),
        ],
      },
      {
        type: "subjective",
        title: "서로에게 남기고 싶은 말을 자유롭게 적는 질문".repeat(4).slice(0, 80),
      },
    ],
  });

  const participantPage = await (await fetch(`${baseUrl}/room/${room.id}?new=1`)).text();
  assert.doesNotMatch(participantPage, /방을 만들었어요|친구를 초대하세요|참여 링크 QR 코드/);
  const creatorPage = await (await fetch(`${baseUrl}/room/${room.id}/share`)).text();
  assert.match(creatorPage, /방을 만들었어요/);

  const lockedApi = await fetch(`${baseUrl}/api/rooms/${room.id}`);
  const lockedBody = await lockedApi.json();
  assert.equal(lockedBody.locked, true);
  const lockedPage = await (await fetch(`${baseUrl}/room/${room.id}/results`)).text();
  assert.match(lockedPage, /참여 후 결과를 볼 수 있어요/);
  assert.equal((await fetch(`${baseUrl}/api/rooms/${room.id}/image`)).status, 403);

  const firstSubmissionId = randomUUID();
  const firstAnswers = answersFor(room, 0);
  const failed = await submitAnswers({
    room,
    submissionId: firstSubmissionId,
    nickname: "가".repeat(20),
    answers: firstAnswers.slice(0, -1),
  });
  assert.equal(failed.status, 400);

  const created = await submitAnswers({
    room,
    submissionId: firstSubmissionId,
    nickname: "가".repeat(20),
    answers: firstAnswers,
  });
  await assertResponseStatus(created, 200);
  assert.equal(created.headers.get("x-submission-status"), "created");
  const firstCookie = responseCookie(created);
  const firstParticipant = await created.json();

  const replayed = await submitAnswers({
    room,
    submissionId: firstSubmissionId,
    nickname: "가".repeat(20),
    answers: firstAnswers,
  });
  await assertResponseStatus(replayed, 200);
  assert.equal(replayed.headers.get("x-submission-status"), "replayed");
  assert.equal((await replayed.json()).id, firstParticipant.id);

  const second = await submitAnswers({
    room,
    submissionId: randomUUID(),
    nickname: "나".repeat(20),
    answers: answersFor(room, 1),
  });
  await assertResponseStatus(second, 200);

  const unlocked = await fetch(`${baseUrl}/api/rooms/${room.id}`, {
    headers: { Cookie: firstCookie },
  });
  const unlockedBody = await unlocked.json();
  assert.equal(unlockedBody.locked, false);
  assert.equal(unlockedBody.participants.length, 2, "a retry must not create another participant");

  await assertPng(await fetch(`${baseUrl}/api/rooms/${room.id}/image`, {
    headers: { Cookie: firstCookie },
  }));
});

test("public flow opens aggregate results anonymously and does not force answer mode on refresh", async () => {
  const room = await createRoom({
    isPublic: true,
    title: "공".repeat(50),
    questions: [0, 1].map((index) => ({
      type: "balance",
      title: `공개방에서 가장 팽팽한 선택을 보여주는 ${index + 1}번째 긴 질문`.repeat(4).slice(0, 80),
      optionA: "공개방 첫 번째 긴 선택지".repeat(3).slice(0, 30),
      optionB: "공개방 두 번째 긴 선택지".repeat(3).slice(0, 30),
    })),
  });

  const beforeAnswers = await (await fetch(`${baseUrl}/api/rooms/${room.id}`)).json();
  assert.equal(beforeAnswers.locked, false);
  assert.deepEqual(beforeAnswers.participants, []);
  await assertPng(await fetch(`${baseUrl}/api/rooms/${room.id}/image`));

  for (const variant of [0, 1]) {
    const response = await submitAnswers({
      room,
      submissionId: randomUUID(),
      nickname: `외부에서 보낸 이름 ${variant}`,
      answers: answersFor(room, variant),
    });
    await assertResponseStatus(response, 200);
  }

  const publicApi = await (await fetch(`${baseUrl}/api/rooms/${room.id}`)).json();
  assert.equal(publicApi.locked, false);
  assert.equal(publicApi.participants.length, 2);
  for (const participant of publicApi.participants) {
    assert.deepEqual(Object.keys(participant), ["answers"]);
  }

  const refreshPage = await (await fetch(`${baseUrl}/room/${room.id}`)).text();
  assert.match(refreshPage, /바로 답하기/);
  assert.doesNotMatch(refreshPage, />나가기</);
  const resultPage = await (await fetch(`${baseUrl}/room/${room.id}/results`)).text();
  assert.doesNotMatch(resultPage, /참여 후 결과를 볼 수 있어요/);
  await assertPng(await fetch(`${baseUrl}/api/rooms/${room.id}/image`));
});
