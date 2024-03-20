import { fixSaultSteMarie } from '@cityssm/is-sault-ste-marie';
import { getFieldValueDescription } from '@cityssm/ncic-lookup';
import { dateToString } from '@cityssm/utils-datetime';
import { NEWLINE, yyToYyyy, yymmddToDateString } from './utilities.js';
function parsePKRA(rowData) {
    if (!rowData.startsWith('PKRA')) {
        return undefined;
    }
    /*
     * PKRA RECORD
     * -----------
     * Record Id    | 4 characters               | "PKRA"
     * DEST-CODE    | 4 characters               | "    "
     * BATCH-NO     | 1 character                | "1"
     * Sent Date    | 6 numbers                  | YYMMDD
     * Record Count | 6 numbers, right justified | "   201"
     * TAPE-NEEDED  | 1 character, Y or N        | Y
     * LABEL-NEEDED | 1 character, Y or N        | N
     * ENTRY-DATE   | 6 numbers                  | YYMMDD
     * Record Date  | 6 numbers                  | YYMMDD
     * FILLER       | 165 characters
     */
    try {
        const record = {};
        const rawSentDate = rowData.slice(9, 15).trim();
        if (rawSentDate === '') {
            return undefined;
        }
        record.sentDate = yymmddToDateString(rawSentDate);
        const rawRecordDate = rowData.slice(29, 35).trim();
        if (rawRecordDate === '') {
            return undefined;
        }
        record.recordDate = yymmddToDateString(rawRecordDate);
        return record;
    }
    catch { }
}
async function parsePKRD(rowData) {
    if (!rowData.startsWith('PKRD')) {
        return undefined;
    }
    /*
     * PKRD RECORD
     * -----------
     * Record Id                 | 4 characters                  | "PKRD"
     * Licence Plate Number      | 10 characters                 | "XXXX111   "
     * Issue Date                | 6 numbers                     | YYMMDD
     * Ticket Number             | 8 characters                  | "XX00000 "
     * INPUT-MAKE                | 4 characters                  |
     * Driver's Licence Number   | 15 characters                 | "A12345123451234"
     * Birth Date                | 6 numbers                     | YYMMDD
     * Gender                    | 1 character                   | M
     * Owner's Name              | 50 characters, "/" separated  | "DOE,JOHN/DOE,JANE                                 "
     * Address                   | 40 characters, including city | "1234 STREET RD,S STE MARIE             "
     * Postal Code               | 6 characters                  | "A1A1A1"
     * Vehicle Make              | 4 characters                  | "CHEV"
     * Vehicle Year              | 2 numbers                     | "17"
     * Odometer Reading          | 8 numbers                     | "123456  "
     * Odometer Unit             | 2 characters                  | "KM"
     * Vehicle Colour            | 3 characters                  | "BLK"
     * Error Code                | 6 characters                  | "WRN262"
     * Error Message             | 29 characters                 | "PLATE WAS UNATTACHED         "
     * Licence Plate Expiry Date | 4 numbers                     | YYMM
     * BRAND                     | 3 characters
     * FILLER                    | 10 characters
     */
    const record = {};
    record.licencePlateNumber = rowData.slice(4, 14).trim();
    record.issueDate = yymmddToDateString(rowData.slice(14, 20));
    record.ticketNumber = rowData.slice(20, 28).trim();
    record.driverLicenceNumber = rowData.slice(32, 47).trim();
    record.ownerGenderKey = rowData.slice(53, 54);
    record.ownerName1 = rowData.slice(54, 104).replaceAll(',', ', ').trim();
    if (record.ownerName1.includes('/')) {
        const slashIndex = record.ownerName1.indexOf('/');
        record.ownerName2 = record.ownerName1.slice(Math.max(0, slashIndex + 1));
        record.ownerName1 = record.ownerName1.slice(0, Math.max(0, slashIndex));
    }
    record.ownerAddress = rowData.slice(104, 144).trim();
    if (record.ownerAddress.includes(',')) {
        const lastCommaIndex = record.ownerAddress.lastIndexOf(',');
        record.ownerCity = record.ownerAddress.slice(Math.max(0, lastCommaIndex + 1));
        record.ownerAddress = record.ownerAddress.slice(0, Math.max(0, lastCommaIndex));
        record.ownerCity = fixSaultSteMarie(record.ownerCity, 'SAULT STE. MARIE');
    }
    record.ownerPostalCode = rowData.slice(144, 150).trim();
    record.vehicleMake = rowData.slice(150, 154).trim();
    record.vehicleMakeDescription = await getFieldValueDescription('VMA', record.vehicleMake);
    record.vehicleYear = yyToYyyy(Number.parseInt(rowData.slice(154, 156), 10));
    record.vehicleColor = rowData.slice(166, 169).trim();
    record.vehicleColorDescription = await getFieldValueDescription('VCO', record.vehicleColor);
    record.errorCode = rowData.slice(169, 175).trim();
    record.errorMessage = rowData.slice(175, 204).trim();
    const expiryYear = yyToYyyy(Number.parseInt(rowData.slice(204, 206), 10));
    const expiryDate = new Date(expiryYear, Number.parseInt(rowData.slice(206, 208), 10) - 1 + 1, 1);
    expiryDate.setDate(expiryDate.getDate() - 1);
    record.licencePlateExpiryDate = dateToString(expiryDate);
    if (record.errorCode !== '') {
        delete record.vehicleYear;
        delete record.licencePlateExpiryDate;
    }
    return record;
}
/**
 * Parses the string data from an MTO results file.
 * @param {string} resultData - A string of results data.
 * @returns {MTOBatchResults} - The parsed results.
 */
export async function parseMTOBatchResult(resultData) {
    // Split the file into rows
    const ownershipDataRows = resultData.split(NEWLINE);
    if (ownershipDataRows.length === 0) {
        throw new Error('The file contains zero data rows.');
    }
    const headerRow = parsePKRA(ownershipDataRows[0]);
    if (headerRow === undefined) {
        throw new Error('An error occurred while trying to parse the first row of the file.');
    }
    const results = {
        sentDate: headerRow.sentDate,
        recordDate: headerRow.recordDate,
        unparsedResultsCount: 0,
        parsedResults: [],
        parsedResultsWithErrors: []
    };
    // Loop through record rows
    for (const ownershipDataRow of ownershipDataRows) {
        try {
            const recordRow = await parsePKRD(ownershipDataRow);
            if (recordRow !== undefined) {
                if (recordRow.errorCode === '') {
                    results.parsedResults.push(recordRow);
                }
                else {
                    results.parsedResultsWithErrors.push(recordRow);
                }
            }
        }
        catch {
            results.unparsedResultsCount += 1;
        }
    }
    return results;
}
