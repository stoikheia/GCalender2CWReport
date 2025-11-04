# カレンダー稼働時間解析スクリプト開発履歴（10月版）

このコンテキストは、Google カレンダーの JSON から日次稼働時間を自動解析するスクリプトの開発経緯・設計意図・最終仕様をまとめたものです。
新しいチャットを始めるときに貼ることで、これまでのすべての開発経緯を再現できます。

---

## 概要
Google カレンダーから取得した予定（JSON形式）をもとに、
1日の稼働・休憩・MTG・暗黙稼働を自動分類し、「10:00〜19:00」を中心とした実質稼働時間を出力。

出力例:
  10/22
  10:15-13:00 2.75h
  13:00-14:00 MTG 1h
  14:00-16:15 2.25h
  16:15-17:15 休憩 1h
  17:15-19:00 1.75h
  19:00-01:00 休憩 6h
  01:00-03:30 2.5h
  8.75h(7h)

---

## 目的
Google Calendar の記録から「実質稼働時間」を日単位で集計したい。
- 休憩／会議／プライベート時間を自動分類
- 暗黙の空白時間を補完
- 翌日早朝までの勤務（Focus time）も同日に集約
- 15分単位で丸め、小数点以下0は省略
- JSONデータを直接貼って検証できるGASスクリプトとして動作

---

## 開発ステップ履歴

Step 1: 初期設計  
- カレンダーイベントをJSONで取得し、稼働・休憩を分類。
- isAllDay（Homeなど）は除外。
- 明示的イベントがない空白は「暗黙稼働」として補完。

Step 2: 休憩ルール導入  
- "Out of office", "Break", "Health condition issue", "Move", "所属元作業" は休憩。
- "Morning routine" は除外扱い。

Step 3: MTG判定と50分ルール  
- "Processor Daily", "Tech Go weekly event", "Processor Inquiry Review" などをMTG扱い。
- 前方一致で判定。
- MTGが50分なら1時間に補正。

Step 4: 暗黙稼働補完ロジック  
- 空白を稼働または休憩で埋める。
- 区間を自動生成し交互に並べる。

Step 5: 全体稼働時間決定  
- 基本稼働時間 10:00〜19:00
- 10:00以前は予定がある時間だけ稼働
- 10:00以降は暗黙稼働
- 19:00以降は暗黙休憩
- 翌日5:00までは同一日扱い

Step 6: Morning routine / Privateルール整理  
- Morning routine は完全除外
- Private は休憩
- Focus time は暗黙稼働

Step 7: 後から始まる予定を優先  
- イベント重複時は後から始まる方を優先して前を短縮。

Step 8: 翌日5:00対応  
- 翌日5:00以前の稼働（Focus time 03:00–04:00など）は同日扱い。

Step 9: 暗黙稼働補完の時間境界拡張  
- 10:00・19:00・翌日5:00で自動分割。

Step 10: 出力整形  
- 時間はHH:MM形式。
- 小数点以下.0は省略。
- 丸めは15分単位。

Step 11: オプションフラグ追加  
- TRIM_END_AFTER_LAST_BREAK = false  
  最後の休憩以降を保持またはカットを切替可能。

Step 12: 10:00暗黙稼働修正  
- 10:00以降に予定があるが、10:00〜最初の予定が空白の場合は必ず10:00から稼働開始。

---

## 最終仕様（v30）

スクリプト名: debugGenerateWorkSegmentsFromJSON_v30

定数:
  TRIM_END_AFTER_LAST_BREAK = false
  BREAK_TITLES = ["Out of office","Break","所属元作業","Health condition issue","Move"]
  MTG_TITLES = [
    "Processor Daily",
    "Tech Go weekly event",
    "[Processor] KPT + Simplified Daily",
    "Processor Inquiry Review",
    "[任意]AI共有会しよう",
    "Zoom/Monthly: UPSIDER Tech All Hands"
  ]

分類ルール:
  Morning routine → 除外  
  Out of office, Break, Move, 所属元作業, Health condition issue → 休憩  
  Focus time → 暗黙稼働  
  Processor Daily など MTG_TITLES 前方一致 or "MTG" 含む → MTG  
  その他 → 稼働

---

出力フォーマット例:
  10/8
  10:30-11:00 0.5h
  11:00-11:30 休憩 0.5h
  11:30-13:00 1.5h
  13:00-14:00 MTG 1h
  14:00-15:00 1h
  15:00-15:30 MTG 0.5h
  15:30-16:15 休憩 0.75h
  16:15-17:30 1.25h
  17:30-18:00 休憩 0.5h
  18:00-19:00 1h
  6.75h(1.75h)

---

想定ユースケース:
- JSONデータを直接貼って結果を確認
- 日付を跨ぐ勤務（〜AM3時など）検証
- Focus timeや休憩ルールの調整
- TRIM_END_AFTER_LAST_BREAK動作確認

---

開始例:
「以下のJSONを10月版スクリプト（v30仕様）で解析した結果を出力してください」
または
「TRIM_END_AFTER_LAST_BREAK=trueにして比較したいです」

---

バージョン履歴:
  v27: 基本処理と休憩除外ロジック構築
  v28b: Morning routine除外 + 明示稼働優先
  v29: 翌日5時対応
  v30: 19時跨ぎ補完 + 10時暗黙稼働修正 + 前方一致MTG対応 完成版

---

現在の状態:
10月分（1〜31日）全データで期待通り出力を確認済み。
すべての稼働・休憩・Focus・MTG判定が整合。
11月以降の拡張・検証はこのv30を基準に行う。

---

保存推奨ファイル名:
「カレンダー稼働解析_10月版コンテキスト.txt」
（このままテキストとして貼るとChatGPTが正確に再現できます）