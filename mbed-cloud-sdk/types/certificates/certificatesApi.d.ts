import { ConnectionOptions, CallbackFn, ListResponse } from "../common/interfaces";
import { AddDeveloperCertificateObject, AddCertificateObject, UpdateCertificateObject, CertificateListOptions } from "./types";
import { Certificate } from "./models/certificate";
/**
 * ## Certificates API
 *
 * This API is initialized with [ConnectionOptions](../interfaces/connectionoptions.html).
 *
 * To create an instance of this API in [Node.js](https://nodejs.org):
 *
 * ```JavaScript
 * var mbedCloudSDK = require("mbed-cloud-sdk");
 *
 * var certificates = new mbedCloudSDK.CertificatesApi({
 *     apiKey: "<mbed Cloud API Key>"
 * });
 * ```
 *
 * To create an instance of this API in the browser:
 *
 * ```html
 * <script src="<mbed-cloud-sdk>/bundles/certificates.min.js"></script>
 *
 * <script>
 *     var certificates = new mbedCloudSDK.CertificatesApi({
 *         apiKey: "<mbed Cloud API Key>"
 *     });
 * </script>
 * ```
 */
export declare class CertificatesApi {
    private _endpoints;
    /**
     * @param options connection options
     */
    constructor(options: ConnectionOptions);
    private extendCertificate(iamCert, done);
    /**
     * List certificates
     * @param options filter options
     * @returns Promise of listResponse
     */
    listCertificates(options?: CertificateListOptions): Promise<ListResponse<Certificate>>;
    /**
     * List certificates
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listCertificates(options?: CertificateListOptions, callback?: CallbackFn<ListResponse<Certificate>>): void;
    /**
     * Get details of a certificate
     * @param certificateId The certificate ID
     * @returns Promise containing the certificate
     */
    getCertificate(certificateId: string): Promise<Certificate>;
    /**
     * Get details of a certificate
     * @param certificateId The certificate ID
     * @param callback A function that is passed the return arguments (error, certificate)
     */
    getCertificate(certificateId: string, callback: CallbackFn<Certificate>): void;
    /**
     * Adds a generated developer certificate
     * @param certificate Certificate request
     * @returns Promise containing certificate
     */
    addCertificate(certificate: AddDeveloperCertificateObject): Promise<Certificate>;
    /**
     * Adds a generated developer certificate
     * @param certificate Certificate request
     * @param callback A function that is passed the return arguments (error, certificate)
     */
    addCertificate(certificate: AddDeveloperCertificateObject, callback: CallbackFn<Certificate>): void;
    /**
     * Adds a certificate
     * @param certificate Certificate request
     * @returns Promise containing certificate
     */
    addCertificate(certificate: AddCertificateObject): Promise<Certificate>;
    /**
     * Adds a certificate
     * @param certificate Certificate request
     * @param callback A function that is passed the return arguments (error, certificate)
     */
    addCertificate(certificate: AddCertificateObject, callback: CallbackFn<Certificate>): void;
    /**
     * Updates a certificate
     * @param certificate Certificate data
     * @returns Promise containing certificate
     */
    updateCertificate(certificate: UpdateCertificateObject): Promise<Certificate>;
    /**
     * Updates a certificate
     * @param certificate Certificate data
     * @param callback A function that is passed the return arguments (error, certificate)
     */
    updateCertificate(certificate: UpdateCertificateObject, callback: CallbackFn<Certificate>): void;
    /**
     * Deletes a certificate
     * @param certificateId The certificate ID
     * @returns Promise containing any error
     */
    deleteCertificate(certificateId: string): Promise<void>;
    /**
     * Deletes a certificate
     * @param certificateId The certificate ID
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteCertificate(certificateId: string, callback: CallbackFn<void>): void;
}
