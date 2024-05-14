import assert from 'node:assert';
import { describe, it } from 'node:test';
import { dateToInteger, dateToString } from '@cityssm/utils-datetime';
import { dateStringToYymmdd, yyToYyyy, yymmddToDateString } from '../utilities.js';
await describe('utilities', async () => {
    await describe('dateToYymmdd()', async () => {
        await it('Converts a Date to a string', async () => {
            assert.strictEqual(dateStringToYymmdd('1970-02-01'), '700201');
        });
    });
    await describe('yymmddToDate()', async () => {
        await it("Converts today's date into today", async () => {
            const currentDate = new Date();
            const currentDateYYMMDD = dateToInteger(currentDate).toString();
            const convertedDateString = yymmddToDateString(currentDateYYMMDD.slice(-6));
            assert.strictEqual(convertedDateString, dateToString(currentDate));
        });
        await it('Ensures dates are in the past', async () => {
            const tomorrowsDate = new Date();
            tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
            const tomorrowsDateYYMMDD = dateToInteger(tomorrowsDate).toString();
            const convertedDateString = yymmddToDateString(tomorrowsDateYYMMDD.slice(-6));
            assert.notStrictEqual(convertedDateString, dateToString(tomorrowsDate));
        });
    });
    await describe('yyToYyyy()', async () => {
        await it('Converts the current year into the current year', async () => {
            const currentYear = new Date().getFullYear();
            const currentYearTwoDigit = currentYear % 100;
            assert.strictEqual(yyToYyyy(currentYearTwoDigit), currentYear);
        });
        await it('Converts next year into the next year', async () => {
            const nextYear = new Date().getFullYear() + 1;
            const nextYearTwoDigit = nextYear % 100;
            assert.strictEqual(yyToYyyy(nextYearTwoDigit), nextYear);
        });
        await it('Converts far future year into a past year', async () => {
            const futureYear = new Date().getFullYear() + 20;
            const futureYearTwoDigit = futureYear % 100;
            assert.notStrictEqual(yyToYyyy(futureYearTwoDigit), futureYear);
        });
    });
});
