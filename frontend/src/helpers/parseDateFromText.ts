export default function parseDateFromText(text: string): string | null {
  const now = new Date();
  const lower = text.toLowerCase();

  const patterns = [
    { regex: /jutro/, handler: () => addDays(now, 1) },
    { regex: /pojutrze/, handler: () => addDays(now, 2) },
    {
      regex: /za\s+(\d+)\s+(dzień|dni)/,
      handler: (match: RegExpMatchArray) => addDays(now, parseInt(match[1]))
    },
    { regex: /za\s+tydzień/, handler: () => addDays(now, 7) },
    {
      regex: /za\s+(\d+)\s+(tydzień|tygodni)/,
      handler: (match: RegExpMatchArray) => addDays(now, parseInt(match[1]) * 7)
    },
    { regex: /za\s+miesiąc/, handler: () => addMonths(now, 1) },
    {
      regex: /za\s+(\d+)\s+(miesiąc|miesięcy)/,
      handler: (match: RegExpMatchArray) => addMonths(now, parseInt(match[1]))
    },


    { regex: /tomorrow/, handler: () => addDays(now, 1) },
    { regex: /in\s+(\d+)\s+(day|days)/, handler: (m: RegExpMatchArray) => addDays(now, parseInt(m[1])) },
    { regex: /in\s+a\s+week/, handler: () => addWeeks(now, 1) },
    { regex: /in\s+(\d+)\s+(week|weeks)/, handler: (m: RegExpMatchArray) => addWeeks(now, parseInt(m[1])) },
    { regex: /in\s+a\s+month/, handler: () => addMonths(now, 1) },
    { regex: /in\s+(\d+)\s+(month|months)/, handler: (m: RegExpMatchArray) => addMonths(now, parseInt(m[1])) },
  ];

  for (const { regex, handler } of patterns) {
    const match = lower.match(regex);
    if (match) {
      const date = handler(match);
      return date.toISOString().split('T')[0];
    }
  }

  return null;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + weeks * 7)
  return result
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
