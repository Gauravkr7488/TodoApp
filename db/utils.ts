/**
 * @description for a comma seperated strings only 
 */
export function stringToArray(s: string): any[] {
  if (!s) return []; // handle empty string
  return s.split(",").map(item => item.trim());
}

export function arrayToCSV(arr: any[]): string {
    return arr.join(',');
}