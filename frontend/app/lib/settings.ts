/**
 * Read settings stored in localStorage by the Settings module.
 * Use these in list pages (table page size) or forms (default address).
 */

const TABLE_PAGE_SIZE_KEY = "lis-table-page-size";
const DEFAULT_REGION_KEY = "lis-default-region-code";
const DEFAULT_PROVINCE_KEY = "lis-default-province-code";

const DEFAULT_PAGE_SIZE = 25;
const VALID_PAGE_SIZES = [10, 25, 50];

export function getTablePageSize(): number {
  if (typeof window === "undefined") return DEFAULT_PAGE_SIZE;
  const v = localStorage.getItem(TABLE_PAGE_SIZE_KEY);
  const n = parseInt(v ?? "", 10);
  return VALID_PAGE_SIZES.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

export function getDefaultRegionCode(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DEFAULT_REGION_KEY) ?? "";
}

export function getDefaultProvinceCode(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DEFAULT_PROVINCE_KEY) ?? "";
}
