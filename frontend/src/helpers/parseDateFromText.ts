export default function parseDateFromText(text: string): string | null {
  const now = new Date();
  const lower = text.toLowerCase();

  const patterns = [
    { regex: /jutro/, handler: () => addDays(now, 1) },
    { regex: /pojutrze/, handler: () => addDays(now, 2) },
    //X miesiąc/miesięcy/miesiące spacja | i X tydzień/tygodnie/tygodni spacja | i dzień/dni
    { regex: /za\s+(?:(\d+)?\s*(?:miesiąc(?:y|e)?))[\si]+(?:(\d+)\s*(?:ty(?:dzień|godnie|godni)))[\si]+(?:(\d+)\s*(?:d(?:zień|ni)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1], 10);
        const weeks  = parseInt(match[2], 10);
        const days   = parseInt(match[3], 10);
        result = addMonths(result, months);
        result = addDays(result, weeks * 7);
        result = addDays(result, days);
        return result;
      }
    },
    //X miesiąc/miesięcy/miesiące spacja | i X tydzień/tygodnie/tygodni
    { regex: /za\s+(?:(\d+)?\s*(?:miesiąc(?:y|e)?))[\si]+(?:(\d+)\s*(?:ty(?:dzień|godnie|godni)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1], 10);
        const weeks  = parseInt(match[2], 10);
        result = addMonths(result, months);
        result = addDays(result, weeks * 7);
        return result;
      }
    },
    //X miesiąc/miesięcy/miesiące spacja | i dzień/dni
    { regex: /za\s+(?:(\d+)?\s*(?:miesiąc(?:y|e)?))[\si]+(?:(\d+)\s*(?:d(?:zień|ni)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1], 10);
        const days   = parseInt(match[2], 10);
        result = addMonths(result, months);
        result = addDays(result, days);
        return result;
      }
    },
    //X tydzień/tygodnie/tygodni spacja | i dzień/dni
    { regex: /za\s+(?:(\d+)?\s*(?:ty(?:dzień|godnie|godni)))[\si]+(?:(\d+)\s*(?:d(?:zień|ni)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const weeks = parseInt(match[1], 10);
        const days   = parseInt(match[2], 10);
        result = addDays(result, weeks * 7);
        result = addDays(result, days);
        return result;
      }
    },
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
    //X month/-s space | and X week/-s space | and day/-s
    {
      regex: /in\s+(?:(\d+)?\s*(?:month(?:s)?))[\s(and)]+(?:(\d+)\s*(?:week(?:s)?))[\s(and)]+(?:(\d+)\s*(?:day(?:s)?))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1]);
        const weeks  = parseInt(match[2]);
        const days   = parseInt(match[3]);
        result = addMonths(result, months);
        result = addDays(result, weeks * 7);
        result = addDays(result, days);
        return result;
      }
    },
    //X month/-s space | and X week/-s
    {
      regex: /in\s+(?:(\d+)?\s*(?:month(?:s)?))[\s(and)]+(?:(\d+)\s*(?:(week(?:s)?)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1]);
        const weeks  = parseInt(match[2]);
        result = addMonths(result, months);
        result = addDays(result, weeks * 7);
        return result;
      }
    },
    //X month/-s space | and X day/-s
    {
      regex: /in\s+(?:(\d+)?\s*(?:month(?:s)?))[\s(and)]+(?:(\d+)\s*(?:(day(?:s)?)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const months = parseInt(match[1]);
        const days = parseInt(match[2]);
        result = addMonths(result, months);
        result = addDays(result, days);
        return result;
      }
    },
    //X week/-s space | and day/-s
    {
      regex: /in\s+(?:(\d+)?\s*(?:week(?:s)?))[\s(and)]+(?:(\d+)\s*(?:(day(?:s)?)))/,
      handler: (match: RegExpMatchArray) => {
        let result = new Date(now);
        const weeks = parseInt(match[1]);
        const days  = parseInt(match[2]);
        result = addDays(result, weeks * 7);
        result = addDays(result, days);
        return result;
      }
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
