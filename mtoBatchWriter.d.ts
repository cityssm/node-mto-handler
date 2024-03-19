import { type DateString } from '@cityssm/utils-datetime';
export interface MTOBatchWriterConfig {
    authorizedUser: string;
    sentDate: DateString;
    includeLabels: boolean;
}
export interface MTOBatchWriterEntry {
    ontarioLicencePlateNumber: string;
    ticketNumber: string;
    issueDate: DateString;
}
export declare class MTOBatchWriter {
    #private;
    constructor(config: MTOBatchWriterConfig, batchEntries?: MTOBatchWriterEntry[]);
    addBatchEntry(batchEntry: MTOBatchWriterEntry): void;
    getBatchSize(): number;
    writeBatch(): string;
}
