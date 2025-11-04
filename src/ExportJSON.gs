function exportCalendarEventsAsJSON(targetDateStr = "2025/10/03") {
  const calendar = CalendarApp.getDefaultCalendar();
  const targetDate = new Date(targetDateStr);
  const start = new Date(targetDate);
  start.setHours(5, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1); // 翌朝5時まで

  const events = calendar.getEvents(start, end).map(ev => ({
    title: ev.getTitle(),
    start: Utilities.formatDate(ev.getStartTime(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    end: Utilities.formatDate(ev.getEndTime(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
    visibility: String(ev.getVisibility()), // ★循環参照を防ぐため文字列化
    description: ev.getDescription() || "",
    isAllDay: ev.isAllDayEvent(),
    location: ev.getLocation() || "",
  }));

  const json = JSON.stringify(events, null, 2);
  Logger.log(json);
  return json;
}