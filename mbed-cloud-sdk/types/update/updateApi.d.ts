import { ConnectionOptions, ListResponse, CallbackFn } from "../common/interfaces";
import { AddFirmwareImageObject, AddFirmwareManifestObject, AddCampaignObject, UpdateCampaignObject, FirmwareImageListOptions, FirmwareManifestListOptions, CampaignListOptions } from "./types";
import { FirmwareImage } from "./models/firmwareImage";
import { FirmwareManifest } from "./models/firmwareManifest";
import { Campaign } from "./models/campaign";
/**
 * ## Update API
 *
 * This API is initialized with [ConnectionOptions](../interfaces/connectionoptions.html).
 *
 * To create an instance of this API in [Node.js](https://nodejs.org):
 *
 * ```JavaScript
 * var mbedCloudSDK = require("mbed-cloud-sdk");
 *
 * var update = new mbedCloudSDK.UpdateApi({
 *     apiKey: "<mbed Cloud API Key>"
 * });
 * ```
 *
 * To create an instance of this API in the browser:
 *
 * ```html
 * <script src="<mbed-cloud-sdk>/bundles/update.min.js"></script>
 *
 * <script>
 *     var update = new mbedCloudSDK.UpdateApi({
 *         apiKey: "<mbed Cloud API Key>"
 *     });
 * </script>
 * ```
 */
export declare class UpdateApi {
    private _endpoints;
    /**
    * @param options connection options
    */
    constructor(options: ConnectionOptions);
    /**
     * List firmware images
     * @param options list options
     * @returns Promise of listResponse
     */
    listFirmwareImages(options?: FirmwareImageListOptions): Promise<ListResponse<FirmwareImage>>;
    /**
     * List firmware images
     * @param options list options
     * @param callback A function that is passed the return arguments (error, listResponse)
     */
    listFirmwareImages(options?: FirmwareImageListOptions, callback?: CallbackFn<ListResponse<FirmwareImage>>): void;
    /**
     * Get details of a firmware image
     * @param firmwareImageId The firmware image ID
     * @returns Promise containing the firmware image
     */
    getFirmwareImage(firmwareImageId: string): Promise<FirmwareImage>;
    /**
     * Get details of a firmware image
     * @param firmwareImageId The firmware image ID
     * @param callback A function that is passed the return arguments (error, firmware image)
     */
    getFirmwareImage(firmwareImageId: string, callback: CallbackFn<FirmwareImage>): void;
    /**
     * Adds a firmware image, returning a Promise
     *
     * Example (Node.js):
     * ```JavaScript
     * var fs = require("fs");
     * ...
     * update.addFirmwareImage({
     *     name: "<FirmwareImage name>",
     *     dataFile: fs.createReadStream("<FirmwareImage file path>")
     * })
     * .then(image => {
     *     console.log(image.url);
     * })
     * .catch(error => {
     *     console.log(error);
     * });
     * ```
     *
     * Example (browser):
     * ```JavaScript
     * <input type="file" id="file">
     * ...
     * document.getElementById("file").addEventListener("change", event => {
     *     let file = event.target.files[0];
     *
     *     updateApi.addFirmwareImage({
     *         name: file.name,
     *         dataFile: file
     *     })
     *     .then(image => {
     *         alert(image.url);
     *     })
     *     .catch(error => {
     *         console.log(error);
     *     });
     * });
     * ```
     *
     * @param image The image to add
     * @returns Promise containing firmware image
     */
    addFirmwareImage(image: AddFirmwareImageObject): Promise<FirmwareImage>;
    /**
     * Adds a firmware image, using a callback function
     *
     * Example (Node.js):
     * ```JavaScript
     * var fs = require("fs");
     * ...
     * update.addFirmwareImage({
     *     name: "<FirmwareImage name>",
     *     dataFile: fs.createReadStream("<FirmwareImage file path>")
     * }, function(error, image) {
     *     if (error) return console.log(error);
     *     console.log(image.url);
     * });
     * ```
     *
     * Example (browser):
     * ```JavaScript
     * <input type="file" id="file">
     * ...
     * document.getElementById("file").addEventListener("change", function(event) {
     *     var file = event.target.files[0];
     *
     *     updateApi.addFirmwareImage({
     *         name: file.name,
     *         dataFile: file
     *     }, function(error, image) {
     *         if (error) return console.log(error);
     *         console.log(image.url);
     *     });
     * });
     * ```
     *
     * @param image The image to add
     * @param callback A function that is passed the return arguments (error, firmware image)
     */
    addFirmwareImage(image: AddFirmwareImageObject, callback: CallbackFn<FirmwareImage>): void;
    /**
     * Deletes a firmware image
     * @param firmwareImageId The ID of the firmware image to delete
     * @returns Promise containing any error
     */
    deleteFirmwareImage(firmwareImageId: string): Promise<void>;
    /**
     * Deletes a firmware image
     * @param firmwareImageId The ID of the firmware image to delete
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteFirmwareImage(firmwareImageId: string, callback: CallbackFn<void>): void;
    /**
     * List firmware manifests
     * @param options list options
     * @returns Promise of listResponse
     */
    listFirmwareManifests(options?: FirmwareManifestListOptions): Promise<ListResponse<FirmwareManifest>>;
    /**
     * List manifests
     * @param options list options
     * @param callback A function that is passed the return arguments (error, listResponse)
     */
    listFirmwareManifests(options?: FirmwareManifestListOptions, callback?: CallbackFn<ListResponse<FirmwareManifest>>): void;
    /**
     * Get details of a firmware manifest
     * @param firmwareManifestId The firmware manifest ID
     * @returns Promise containing the firmware manifest
     */
    getFirmwareManifest(firmwareManifestId: string): Promise<FirmwareManifest>;
    /**
     * Get details of a firmware manifest
     * @param firmwareManifestId The firmware manifest ID
     * @param callback A function that is passed the return arguments (error, firmware manifest)
     */
    getFirmwareManifest(firmwareManifestId: string, callback: CallbackFn<FirmwareManifest>): void;
    /**
     * Adds a firmware manifest, returning a Promise
     *
     * Example (Node.js):
     * ```JavaScript
     * var fs = require("fs");
     * ...
     * update.addFirmwareManifest({
     *     name: "<FirmwareManifest name>",
     *     dataFile: fs.createReadStream("<FirmwareManifest file path>")
     * })
     * .then(manifest => {
     *     console.log(manifest.url);
     * })
     * .catch(error => {
     *     console.log(error);
     * });
     * ```
     *
     * Example (browser):
     * ```JavaScript
     * <input type="file" id="file">
     * ...
     * document.getElementById("file").addEventListener("change", event => {
     *     let file = event.target.files[0];
     *
     *     updateApi.addFirmwareManifest({
     *         name: file.name,
     *         dataFile: file
     *     })
     *     .then(manifest => {
     *         alert(manifest.url);
     *     })
     *     .catch(error => {
     *         console.log(error);
     *     });
     * });
     * ```
     *
     * @param manifest The manifest to add
     * @returns Promise containing firmware manifest
     */
    addFirmwareManifest(manifest: AddFirmwareManifestObject): Promise<FirmwareManifest>;
    /**
     * Adds a firmware manifest, using a callback function
     *
     * Example (Node.js):
     * ```JavaScript
     * var fs = require("fs");
     * ...
     * update.addFirmwareManifest({
     *     name: "<FirmwareManifest name>",
     *     dataFile: fs.createReadStream("<FirmwareManifest file path>")
     * }, function(error, manifest) {
     *     if (error) return console.log(error);
     *     console.log(manifest.url);
     * });
     * ```
     *
     * Example (browser):
     * ```JavaScript
     * <input type="file" id="file">
     * ...
     * document.getElementById("file").addEventListener("change", function(event) {
     *     var file = event.target.files[0];
     *
     *     updateApi.addFirmwareManifest({
     *         name: file.name,
     *         dataFile: file
     *     }, function(error, manifest) {
     *         if (error) return console.log(error);
     *         console.log(manifest.url);
     *     });
     * });
     * ```
     *
     * @param manifest The manifest to add
     * @param callback A function that is passed the return arguments (error, firmware manifest)
     */
    addFirmwareManifest(manifest: AddFirmwareManifestObject, callback: CallbackFn<FirmwareManifest>): void;
    /**
     * Deletes a firmware manifest
     * @param firmwareManifestId The ID of the firmware manifest to delete
     * @returns Promise containing any error
     */
    deleteFirmwareManifest(firmwareManifestId: string): Promise<void>;
    /**
     * Deletes a firmware manifest
     * @param firmwareManifestId The ID of the firmware manifest to delete
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteFirmwareManifest(firmwareManifestId: string, callback: CallbackFn<void>): void;
    /**
     * List update campaigns
     * @param options list options
     * @returns Promise of listResponse
     */
    listCampaigns(options?: CampaignListOptions): Promise<ListResponse<Campaign>>;
    /**
     * List update campaigns
     * @param options list options
     * @param callback A function that is passed the return arguments (error, listResponse)
     */
    listCampaigns(options?: CampaignListOptions, callback?: CallbackFn<ListResponse<Campaign>>): void;
    /**
     * Get details of an update campaign
     * @param campaignId The update campaign ID
     * @returns Promise containing the update campaign
     */
    getCampaign(campaignId: string): Promise<Campaign>;
    /**
     * Get details of an update campaign
     * @param campaignId The update campaign ID
     * @param callback A function that is passed the return arguments (error, update campaign)
     */
    getCampaign(campaignId: string, callback: CallbackFn<Campaign>): void;
    /**
     * Adds an update campaign
     * @param campaign The campaign to add
     * @returns Promise containing update campaign
     */
    addCampaign(campaign: AddCampaignObject): Promise<Campaign>;
    /**
     * Adds an update campaign
     * @param campaign The campaign to add
     * @param callback A function that is passed the return arguments (error, update campaign)
     */
    addCampaign(campaign: AddCampaignObject, callback: CallbackFn<Campaign>): void;
    /**
     * Update an update campaign
     * @param campaign The campaign to update
     * @returns Promise of campaign
     */
    updateCampaign(campaign: UpdateCampaignObject): Promise<Campaign>;
    /**
     * Update an update campaign
     * @param campaign The campaign to update
     * @param callback A function that is passed the arguments (error, campaign)
     */
    updateCampaign(campaign: UpdateCampaignObject, callback: CallbackFn<Campaign>): void;
    /**
     * Deletes an update campaign
     * @param campaignId The ID of the update campaign to delete
     * @returns Promise containing any error
     */
    deleteCampaign(campaignId: string): Promise<void>;
    /**
     * Deletes an update campaign
     * @param campaignId The ID of the update campaign to delete
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteCampaign(campaignId: string, callback: CallbackFn<void>): void;
    /**
     * Start an update campaign
     * @param campaignId The ID of the update campaign
     * @returns Promise containing campaign
     */
    startCampaign(campaignId: string): Promise<Campaign>;
    /**
     * Start an update campaign
     * @param campaignId The ID of the update campaign
     * @param callback A function that is passed the return arguments (error, campaign)
     */
    startCampaign(campaignId: string, callback: CallbackFn<Campaign>): void;
    /**
     * Stop an update campaign
     * @param campaignId The ID of the update campaign
     * @returns Promise containing campaign
     */
    stopCampaign(campaignId: string): Promise<Campaign>;
    /**
     * Stop an update campaign
     * @param campaignId The ID of the update campaign
     * @param callback A function that is passed the return arguments (error, campaign)
     */
    stopCampaign(campaignId: string, callback: CallbackFn<Campaign>): void;
}
