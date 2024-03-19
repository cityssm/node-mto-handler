import { type DateString } from '@cityssm/utils-datetime';
export declare const NEWLINE = "\n";
/**
 * Formats a date string as a string in YYMMDD, the preferred MTO format.
 * @param {string} dateString - A date formatted as YYYY-MM-DD
 * @returns {string} - A date formatted as YYMMDD.
 */
export declare function dateStringToYymmdd(dateString: DateString): `${number}`;
/**
 * Formats a date in YYMMDD format to a past JavaScript date.
 * @param {string} yymmdd - A date formatted as YYMMDD.
 * @returns {Date} - A JavaScript Date in the past.
 */
export declare function yymmddToDateString(yymmdd: string): DateString;
/**
 * Adds the century prefix to a two-digit year.
 * @param {number} yy - A two-digit year.
 * @returns {number} - A four-digit year, no more than 10 years in the future.
 */
export declare function yyToYyyy(yy: number): number;
