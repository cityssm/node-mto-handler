import { type DateString } from '@cityssm/utils-datetime';
export interface MTOBatchResultEntry {
    licencePlateNumber: string;
    issueDate: DateString;
    ticketNumber: string;
    driverLicenceNumber: string;
    ownerGenderKey: string;
    ownerName1: string;
    ownerName2: string;
    ownerAddress: string;
    ownerCity: string;
    ownerProvince: string;
    ownerPostalCode: string;
    vehicleMake: string;
    vehicleMakeDescription?: string;
    vehicleYear?: number;
    vehicleColor: string;
    vehicleColorDescription?: string;
    errorCode: string;
    errorMessage: string;
    licencePlateExpiryDate?: DateString;
}
export interface MTOBatchResults {
    sentDate: DateString;
    recordDate: DateString;
    unparsedResultsCount: number;
    parsedResults: MTOBatchResultEntry[];
    parsedResultsWithErrors: MTOBatchResultEntry[];
}
/**
 * Parses the string data from an MTO results file.
 * @param {string} resultData - A string of results data.
 * @returns {MTOBatchResults} - The parsed results.
 */
export declare function parseMTOBatchResult(resultData: string): Promise<MTOBatchResults>;
