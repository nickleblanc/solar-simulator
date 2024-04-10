import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateString(date: Date) {
  return `${date.getFullYear().toString()},${(
    date.getMonth() + 1
  ).toString()},${date.getDate().toString()}`;
}

export const stringToDollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getSavings(data: any) {
  if (!data) {
    return 0;
  }
  let t1 = data.histsearch.times[1][9] + data.histsearch.times[1][10];
  let t2 = data.histsearch.times[2][9] + data.histsearch.times[2][10];
  let diff = t2 - t1;
  diff = diff / 60;
  let sum = 0;
  for (const el of data.histsearch.acpower) {
    sum += el;
  }
  let savings = (sum * diff * 15.87) / 100000;
  return savings;
}

function convertToObj(a: string[], b: number[]) {
  if (a.length != b.length || a.length == 0 || b.length == 0) {
    return null;
  }

  let object = a.map((val1, index) => ({
    time: val1,
    acpower: b[index],
  }));

  return object;
}

export function createExcel(data: any) {
  let arrayOfObjects = convertToObj(
    data.histsearch.times,
    data.histsearch.acpower
  );
  if (!arrayOfObjects) {
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(arrayOfObjects);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "solar-data.xlsx");
}
