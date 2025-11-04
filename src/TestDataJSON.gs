function debugGenerateWorkSegmentsFromJSON_v30() {
  const json = MyCalenderJSON1030;
  const TRIM_END_AFTER_LAST_BREAK = false;

  // --- JSON読み込み・前処理 ---
  const events = JSON.parse(json)
    .filter(e => !e.isAllDay && !/Morning routine/i.test(e.title))
    .map(e => ({
      title: e.title.trim(),
      start: new Date(e.start.replace(" ", "T")),
      end: new Date(e.end.replace(" ", "T")),
    }))
    .sort((a, b) => a.start - b.start);

  const BREAK_TITLES = [
    "Out of office",
    "Break",
    "所属元作業",
    "Health condition issue",
    "Move",
  ];

  const MTG_TITLES = [
    "Processor Daily",
    "Tech Go weekly event",
    "[Processor] KPT + Simplified Daily",
    "Processor Inquiry Review",
    "[任意]AI共有会しよう",
    "Zoom/Monthly: UPSIDER Tech All Hands",
  ];

  const baseDate = events.length > 0 ? new Date(events[0].start) : new Date();
  const dayStart = new Date(baseDate); dayStart.setHours(5, 0, 0, 0);
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
  const defaultStart = new Date(dayStart); defaultStart.setHours(10, 0, 0, 0);
  const defaultEnd = new Date(dayStart); defaultEnd.setHours(19, 0, 0, 0);

  // --- イベント分類 ---
  const explicit = [];
  for (const e of events) {
    if (e.end <= dayStart || e.start >= dayEnd) continue;
    const s = new Date(Math.max(e.start, dayStart));
    let t = new Date(Math.min(e.end, dayEnd));
    if (s >= t) continue;

    let label = "";
    const titleLower = e.title.toLowerCase();
    const isBreak = BREAK_TITLES.some(tit => titleLower.startsWith(tit.toLowerCase()));
    const isFocus = titleLower === "focus time";
    const isMTGTitle = MTG_TITLES.some(tit => e.title.startsWith(tit));
    const hasMTGWord = e.title.includes("MTG");

    if (isBreak) label = "休憩";
    else if (isFocus) label = ""; // Focus time は暗黙稼働
    else if (isMTGTitle || hasMTGWord) label = "MTG";
    else label = e.title;

    explicit.push({ start: s, end: t, label });
  }

  // --- ✅ 重複調整：「後から始まる予定を優先」 ---
  explicit.sort((a, b) => a.start - b.start);
  for (let i = 0; i < explicit.length - 1; i++) {
    const current = explicit[i];
    for (let j = i + 1; j < explicit.length; j++) {
      const next = explicit[j];
      if (current.start < next.end && next.start < current.end) {
        current.end = new Date(Math.min(current.end, next.start));
        if (current.end <= current.start) current._remove = true;
      }
    }
  }
  for (let i = explicit.length - 1; i >= 0; i--) {
    if (explicit[i]._remove || explicit[i].end <= explicit[i].start) explicit.splice(i, 1);
  }

  // ✅ hours を再計算
  for (const e of explicit) {
    e.hours = (e.end - e.start) / 3600000;
    if (e.label === "MTG" && e.hours >= 0.8 && e.hours <= 0.9) {
      e.end = new Date(e.start.getTime() + 60 * 60 * 1000);
      e.hours = 1.0;
    }
  }

  // === 稼働開始・終了決定（絶対時間版） ===
  let workStart = new Date(defaultStart);
  let workEnd = new Date(defaultEnd);

  // 10:00以前に明示的稼働がある → その最初のstartを採用
  const earlyWork = explicit.find(e =>
    e.start < defaultStart && e.label !== "休憩" && e.end > dayStart
  );
  if (earlyWork) workStart = earlyWork.start;

  // 10:00から始まる休憩（Out of office など）に対応
  const restAt10 = explicit.find(e =>
    e.label === "休憩" && e.start <= defaultStart && e.end > defaultStart
  );
  const hasEventBefore10 = explicit.some(e => e.end <= defaultStart);
  if (restAt10 && !hasEventBefore10) {
    workStart = new Date(restAt10.end);
  }

  // ✅ 修正点：10:00以降に予定がある場合は 10:00 から稼働開始
  const hasAnyAfter10 = explicit.some(e => e.start >= defaultStart && e.start < defaultEnd);
  if (!earlyWork && !restAt10 && hasAnyAfter10) {
    workStart = new Date(defaultStart);
  }

  // --- 稼働終了を決定 ---
  // 19:00以降に明示的稼働がある場合 → その終了を延長
  const lateWork = explicit
    .filter(e => e.label !== "休憩" && e.end > defaultEnd && e.end <= dayEnd)
    .sort((a, b) => b.end - a.end)[0];
  if (lateWork) {
    workEnd = lateWork.end;
  }

  // 19:00以降の休憩で終了している場合の調整
  const lastBreak = explicit.slice().reverse().find(e =>
    e.label === "休憩" && e.start < dayEnd && e.start < workEnd
  );
  if (lastBreak) {
    const hasExplicitAfter = explicit.some(e => e.start >= lastBreak.end && e.label !== "休憩");
    const endsBefore19 = lastBreak.end <= defaultEnd;
    if (!hasExplicitAfter && !endsBefore19) {
      if (TRIM_END_AFTER_LAST_BREAK) {
        workEnd = new Date(Math.min(lastBreak.start, workEnd));
      } else {
        workEnd = new Date(Math.min(lastBreak.end, workEnd));
      }
    }
  }

  // 翌日5時以前に稼働がある場合は同日扱い（例: Focus time 03:00〜04:00）
  const postMidnightWork = explicit.find(e =>
    e.label !== "休憩" && e.start >= defaultEnd && e.end <= dayEnd
  );
  if (postMidnightWork) {
    workEnd = new Date(Math.max(workEnd, postMidnightWork.end));
  }

// --- 暗黙稼働補完 ---
const merged = [];
let cursor = new Date(workStart);

const ten = new Date(dayStart); ten.setHours(10, 0, 0, 0);
const nineteen = new Date(dayStart); nineteen.setHours(19, 0, 0, 0);
const nextFive = new Date(dayEnd); // 翌日5:00

// ✅ 10:00・19:00・翌日5:00を跨ぐ場合は自動分割
const splitIfCrossesKeyTimes = (start, end) => {
  const boundaries = [ten, nineteen, nextFive];
  const points = boundaries.filter(t => start < t && end > t);
  if (points.length === 0) return [{ start, end }];

  const segments = [];
  let segStart = start;
  for (const boundary of points) {
    segments.push({ start: segStart, end: boundary });
    segStart = boundary;
  }
  segments.push({ start: segStart, end });
  return segments;
};

for (const seg of explicit) {
  if (seg.end <= workStart || seg.start >= workEnd) continue;

  if (cursor < seg.start) {
    const fillEnd = new Date(Math.min(seg.start, workEnd));
    for (const part of splitIfCrossesKeyTimes(cursor, fillEnd)) {
      const isBefore10 = part.start < ten;
      const isAfter19 = part.start >= nineteen;
      const label = (isBefore10 || isAfter19) ? "休憩" : "";
      merged.push({
        start: new Date(part.start),
        end: new Date(part.end),
        label,
        hours: (part.end - part.start) / 3600000
      });
    }
  }

  merged.push(seg);
  cursor = new Date(Math.max(cursor, seg.end));
}

if (cursor < workEnd) {
  for (const part of splitIfCrossesKeyTimes(cursor, workEnd)) {
    const isBefore10 = part.start < ten;
    const isAfter19 = part.start >= nineteen;
    const label = (isBefore10 || isAfter19) ? "休憩" : "";
    merged.push({
      start: part.start,
      end: part.end,
      label,
      hours: (part.end - part.start) / 3600000
    });
  }
}

  // --- 出力整形 ---
  const round15min = h => Math.round(h * 4) / 4;
  const fmt = h => (h % 1 === 0) ? `${h}h`.replace(".0", "") : `${h}h`;
  const pad = n => String(n).padStart(2, "0");
  const format = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const workDate = merged.length > 0 ? merged[0].start : baseDate;
  const dateStr = `${workDate.getMonth() + 1}/${workDate.getDate()}`;

  let lines = [dateStr];
  let total = 0, rest = 0;
  for (const s of merged) {
    const rounded = round15min(s.hours);
    const labelText = s.label ? ` ${s.label}` : "";
    lines.push(`${format(s.start)}-${format(s.end)}${labelText} ${fmt(rounded)}`);
    if (s.label === "休憩") rest += rounded;
    else total += rounded;
  }

  total = round15min(total);
  rest = round15min(rest);
  lines.push(`${fmt(total)}(${fmt(rest)})`);

  Logger.log(lines.join("\n"));
  return lines.join("\n");
}