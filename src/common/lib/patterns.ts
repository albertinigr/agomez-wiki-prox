import { LOCALES } from './constants';

// Date format: YYYY-MM-DD
export const datePattern: RegExp =
  /^([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/;

export const localePattern: RegExp = /^[a-z]{2}$/;

export const isValidDateParam = (date: string): boolean => {
  if (!date) return false;
  return datePattern.test(date);
};

export const isValidLocaleParam = (locale: string): boolean => {
  if (!locale) return false;
  return localePattern.test(locale) && LOCALES.includes(locale);
};
