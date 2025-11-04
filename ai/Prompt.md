# カレンダー稼働解析スクリプト（10月版）再開用プロンプト

このプロンプトを新しいチャットの最初に貼ると、
Google カレンダー稼働時間解析スクリプト（v30仕様）の全仕様を引き継いだ状態で再開できます。

---

## コンテキスト
私は Google カレンダーの予定データ（JSON）を入力し、
1日の稼働時間・休憩時間・会議時間を自動算出する Google Apps Script（GAS）を開発しています。

このスクリプトは 2025年10月分までのデータで動作検証済みであり、
以下の条件・仕様・定数をすべて前提としています。

---

## 仕様要約

- JSONから予定を読み取り、稼働／休憩／MTGを分類して日単位に出力。
- Morning routine は除外。
- Focus time は暗黙稼働として扱う（出力には表示されない）。
- Out of office / Break / 所属元作業 / Move / Health condition issue は休憩。
- Processor Daily / Tech Go weekly event / Processor Inquiry Review / [任意]AI共有会しよう などは MTG。
- MTG は前方一致で判定、50分未満なら 1h に補正。
- 予定が重複する場合は「後から始まる予定を優先」して前を短縮。
- 暗黙稼働補完は 10:00 / 19:00 / 翌日5:00 を境界に分割。
- 翌日5:00 以前の稼働（例: Focus time 03:00–04:00）は同日扱い。
- 15分単位で丸め、小数点以下0は省略。

---

## 稼働時間ルール
- 基本稼働時間：10:00〜19:00  
- 10:00以前 → 予定のある時間のみ稼働（空きは休憩）  
- 10:00以降 → 明示イベントがなくても暗黙稼働  
- 19:00以降 → 明示イベントがなければ休憩  
- 翌日5:00までは同一日の延長として扱う。

---

## オプション設定
- TRIM_END_AFTER_LAST_BREAK = false  
  最後の休憩以降を「休憩として保持」または「切り捨て」を切り替え可能。

---

## 出力形式
  10/22
  10:15-13:00 2.75h
  13:00-14:00 MTG 1h
  14:00-16:15 2.25h
  16:15-17:15 休憩 1h
  17:15-19:00 1.75h
  19:00-01:00 休憩 6h
  01:00-03:30 2.5h
  8.75h(7h)

- 各行：`開始-終了 種別 時間`
- 最後の行：`合計稼働時間(休憩時間)`

---

## スクリプトバージョン
  debugGenerateWorkSegmentsFromJSON_v30

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

---

## 使い方例

次のように入力します：

> 以下のJSONを、10月版スクリプト（v30仕様）で解析した出力を確認してください。

または：

> TRIM_END_AFTER_LAST_BREAK = true に設定した場合の出力を比較してください。

---

## バージョン履歴
  v27: 基本集計処理・休憩除外ロジック構築  
  v28b: Morning routine除外 + 明示稼働優先ロジック  
  v29: 翌日5時対応  
  v30: 19時跨ぎ補完 + 10時暗黙稼働修正 + 前方一致MTG対応 完成版

---

## 現在の状態
2025年10月分（1日〜31日）すべてのデータで期待通りの結果を確認済み。
休憩・稼働・Focus・MTGの全分類が安定動作。
今後の拡張・新月データ検証はこのv30仕様を基準に行う。