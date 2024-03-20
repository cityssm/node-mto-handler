import { NEWLINE, dateStringToYymmdd } from './utilities.js';
export class MTOBatchWriter {
    #config;
    #batchEntries;
    constructor(config, batchEntries) {
        this.#config = config;
        this.#batchEntries = batchEntries ?? [];
    }
    addBatchEntry(batchEntry) {
        this.#batchEntries.push(batchEntry);
    }
    getBatchSize() {
        return this.#batchEntries.length;
    }
    writeBatch() {
        let output = '';
        /*
         * RECORD ROWS
         * -----------
         * Record Id       | 4 characters  | "PKTD"
         * Plate Number    | 10 characters | "XXXX111   "
         * Issue Date      | 6 numbers     | YYMMDD
         * Ticket Number   | 23 characters | "XX00000                  "
         * Authorized User | 4 characters  | "XX00"
         */
        const authorizedUserPadded = this.#config.authorizedUser
            .padStart(4)
            .slice(0, 4);
        for (const entry of this.#batchEntries) {
            output +=
                'PKTD' +
                    entry.licencePlateNumber.padEnd(10).slice(0, 10) +
                    dateStringToYymmdd(entry.issueDate) +
                    entry.ticketNumber.padEnd(23).slice(0, 23) +
                    authorizedUserPadded +
                    NEWLINE;
        }
        const recordCountPadded = this.#batchEntries.length
            .toString()
            .padStart(6, '0')
            .slice(-6);
        /*
         * HEADER ROW
         * ----------
         * Record Id    | 4 characters           | "PKTA"
         * Unknown      | 5 characters           | "    1"
         * Export Date  | 6 numbers              | YYMMDD
         * Record Count | 6 numbers, zero padded | 000201
         * RET-TAPE     | 1 character, Y or N    | Y
         * CERT-LABEL   | 1 character, Y or N    | N
         */
        output =
            'PKTA' +
                '    1' +
                dateStringToYymmdd(this.#config.sentDate) +
                recordCountPadded +
                'Y' +
                (this.#config.includeLabels ? 'Y' : 'N') +
                NEWLINE +
                output;
        /*
         * FOOTER ROW
         * ----------
         * Record Id    | 4 characters           | "PKTZ"
         * Record Count | 6 numbers, zero padded | 000201
         */
        output += 'PKTZ' + recordCountPadded + NEWLINE;
        return output;
    }
}
