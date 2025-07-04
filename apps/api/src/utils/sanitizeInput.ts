export default function sanitizeInput(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  } else if (obj !== null && typeof obj === "object") {
    const parsed: any = {};
    for (const key in obj) {
      parsed[key] = sanitizeInput(obj[key]);
    }
    return parsed;
  } else if (typeof obj === "string") {
    const trimmed = obj.trim();
    if (trimmed === "") return null;
    if (isIsoDate(trimmed)) return new Date(trimmed);
    return trimmed;
  }
  return obj;
}

function isIsoDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(str);
}
