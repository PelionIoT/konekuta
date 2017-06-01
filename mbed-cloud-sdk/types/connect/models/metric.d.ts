/**
 * Metric
 */
export declare class Metric {
    /**
     * UTC time in RFC3339 format
     */
    readonly timestamp?: Date;
    /**
     * Number of transaction events from devices linked to the account.
     */
    readonly transactions?: number;
    /**
     * Number of successful bootstraps the account has used.
     */
    readonly successfulDeviceRegistrations?: number;
    /**
     * Number of pending bootstraps the account has used.
     */
    readonly pendingDeviceRegistrations?: number;
    /**
     * Number of failed bootstraps the account has used.
     */
    readonly failedDeviceRegistrations?: number;
    /**
     * Number of successful device server REST API requests the account has used.
     */
    readonly successfulApiCalls?: number;
    /**
     * Number of failed device server REST API requests the account has used.
     */
    readonly failedApiCalls?: number;
    constructor(init?: Partial<Metric>);
}
