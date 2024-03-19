import { dateIntegerToString, dateStringToInteger } from '@cityssm/utils-datetime';
export const NEWLINE = '\n';
/**
 * Formats a date string as a string in YYMMDD, the preferred MTO format.
 * @param {string} dateString - A date formatted as YYYY-MM-DD
 * @returns {string} - A date formatted as YYMMDD.
 */
export function dateStringToYymmdd(dateString) {
    return dateStringToInteger(dateString)
        .toString()
        .slice(-6);
}
let currentDate;
let currentYearPrefix;
let currentDateExpiryMillis = 0;
function resetCurrentDate() {
    if (Date.now() - currentDateExpiryMillis <= 86_400 * 1000) {
        return;
    }
    currentDate = new Date();
    currentYearPrefix = Math.floor(currentDate.getFullYear() / 100) * 100;
    currentDateExpiryMillis = Date.now();
}
/**
 * Formats a date in YYMMDD format to a past JavaScript date.
 * @param {string} yymmdd - A date formatted as YYMMDD.
 * @returns {Date} - A JavaScript Date in the past.
 */
export function yymmddToDateString(yymmdd) {
    resetCurrentDate();
    let year = Number.parseInt(yymmdd.slice(0, 2), 10) + currentYearPrefix;
    const month = Number.parseInt(yymmdd.slice(2, 4), 10);
    const day = Number.parseInt(yymmdd.slice(4, 6), 10);
    const date = new Date(year, month - 1, day);
    if (date.getTime() > Date.now()) {
        year -= 100;
    }
    return dateIntegerToString(year * 10_000 + month * 100 + day);
}
/**
 * Adds the century prefix to a two-digit year.
 * @param {number} yy - A two-digit year.
 * @returns {number} - A four-digit year, no more than 10 years in the future.
 */
export function yyToYyyy(yy) {
    resetCurrentDate();
    const fourDigitYear = yy + currentYearPrefix;
    if (fourDigitYear > currentDate.getFullYear() + 10) {
        return fourDigitYear - 100;
    }
    else if (currentDate.getFullYear() - fourDigitYear > 60) {
        return fourDigitYear + 100;
    }
    return fourDigitYear;
}
