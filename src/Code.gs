function ExportDailyWorkSummary(targetDateStr = "2025/10/31") {
  json = exportCalendarEventsAsJSON(targetDateStr);
  generateText(json);
}