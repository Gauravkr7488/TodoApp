/**
 * @description for a comma seperated strings only 
 */
export function stringToArray(s: string): string[] {
  if (!s) return []; // handle empty string
  return s.split(",").map(item => item.trim());
}