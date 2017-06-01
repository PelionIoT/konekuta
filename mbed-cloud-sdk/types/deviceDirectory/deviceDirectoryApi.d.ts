import { ConnectionOptions, ListResponse, CallbackFn } from "../common/interfaces";
import { AddDeviceObject, UpdateDeviceObject, AddQueryObject, UpdateQueryObject, DeviceListOptions, QueryListOptions, DeviceEventListOptions } from "./types";
import { Device } from "./models/device";
import { Query } from "./models/query";
import { DeviceEvent } from "./models/deviceEvent";
/**
 * ## Device Directory API
 *
 * This API is initialized with [ConnectionOptions](../interfaces/connectionoptions.html).
 *
 * To create an instance of this API in [Node.js](https://nodejs.org):
 *
 * ```JavaScript
 * var mbedCloudSDK = require("mbed-cloud-sdk");
 *
 * var devices = new mbedCloudSDK.DeviceDirectoryApi({
 *     apiKey: "<mbed Cloud API Key>"
 * });
 * ```
 *
 * To create an instance of this API in the browser:
 *
 * ```html
 * <script src="<mbed-cloud-sdk>/bundles/device-directory.min.js"></script>
 *
 * <script>
 *     var devices = new mbedCloudSDK.DeviceDirectoryApi({
 *         apiKey: "<mbed Cloud API Key>"
 *     });
 * </script>
 * ```
 */
export declare class DeviceDirectoryApi {
    private _endpoints;
    /**
     * @param options connection objects
     */
    constructor(options: ConnectionOptions);
    /**
     * Gets a list of devices
     * @param options list options
     * @returns Promise of devices
     */
    listDevices(options?: DeviceListOptions): Promise<ListResponse<Device>>;
    /**
     * Gets a list of devices
     * @param options list options
     * @param callback A function that is passed the arguments (error, devices)
     */
    listDevices(options?: DeviceListOptions, callback?: CallbackFn<ListResponse<Device>>): void;
    /**
     * Gets details of a device
     * @param deviceId Device ID
     * @returns Promise of device
     */
    getDevice(deviceId: string): Promise<Device>;
    /**
     * Gets details of a device
     * @param deviceId Device ID
     * @param callback A function that is passed the arguments (error, device)
     */
    getDevice(deviceId: string, callback: CallbackFn<Device>): void;
    /**
     * Add a device
     * @param device Device details
     * @returns Promise of device
     */
    addDevice(device: AddDeviceObject): Promise<Device>;
    /**
     * Add a device
     * @param device Device details
     * @param callback A function that is passed the arguments (error, device)
     */
    addDevice(device: AddDeviceObject, callback: CallbackFn<Device>): void;
    /**
     * Update a device
     * @param device Device details
     * @returns Promise of device
     */
    updateDevice(device: UpdateDeviceObject): Promise<Device>;
    /**
     * Update a device
     * @param device Device details
     * @param callback A function that is passed the arguments (error, device)
     */
    updateDevice(device: UpdateDeviceObject, callback: CallbackFn<Device>): void;
    /**
     * Delete a device
     * @param deviceId Device ID
     * @returns Promise containing any error
     */
    deleteDevice(deviceId: string): Promise<void>;
    /**
     * Delete a device
     * @param deviceId Device ID
     * @param callback A function that is passed any error
     */
    deleteDevice(deviceId: string, callback: CallbackFn<void>): void;
    /**
     * List queries
     * @param options list options
     * @param callback A function containing a list response
     * @returns Promise containing a list response
     */
    listQueries(options?: QueryListOptions): Promise<ListResponse<Query>>;
    /**
     * List queries
     * @param options list options
     * @param callback A function containing a list response
     * @returns Promise containing a list response
     */
    listQueries(options?: QueryListOptions, callback?: CallbackFn<ListResponse<Query>>): void;
    /**
     * Get a query
     * @param queryId query ID
     * @param callback A function that is passed the arguments (error, query)
     * @returns Promise of query
     */
    getQuery(queryId: string): Promise<Query>;
    /**
     * Get a query
     * @param queryId query ID
     * @param callback A function that is passed the arguments (error, query)
     * @returns Promise of query
     */
    getQuery(queryId: string, callback: CallbackFn<Query>): void;
    /**
     * Add a query
     * @param query The query
     * @returns Promise of query
     */
    addQuery(query: AddQueryObject): Promise<Query>;
    /**
     * Add a query
     * @param query The query
     * @param callback A function that is passed the arguments (error, query)
     */
    addQuery(query: AddQueryObject, callback: CallbackFn<Query>): void;
    /**
     * Update a query
     * @param query The query to update
     * @returns Promise of query
     */
    updateQuery(query: UpdateQueryObject): Promise<Query>;
    /**
     * Update a query
     * @param query The query to update
     * @param callback A function that is passed the arguments (error, query)
     */
    updateQuery(query: UpdateQueryObject, callback: CallbackFn<Query>): void;
    /**
     * Delete a query
     * @param queryId query ID
     * @returns Promise containing any error
     */
    deleteQuery(queryId: string): Promise<void>;
    /**
     * Delete a query
     * @param queryId query ID
     * @param callback A function that is passed any error
     */
    deleteQuery(queryId: string, callback: CallbackFn<void>): void;
    /**
     * List device events
     * @param options filter options
     * @returns Promise of listResponse
     */
    listDeviceEvents(options?: DeviceEventListOptions): Promise<ListResponse<DeviceEvent>>;
    /**
     * List device events
     * @param options filter options
     * @param callback A function that is passed the return arguments (error, listResponse)
     */
    listDeviceEvents(options?: DeviceEventListOptions, callback?: CallbackFn<ListResponse<DeviceEvent>>): void;
    /**
     * Get a single device event
     * @param deviceEventId device event ID
     * @returns Promise of device event
     */
    getDeviceEvent(deviceEventId: string): Promise<DeviceEvent>;
    /**
     * Get a single device event
     * @param deviceEventId device event ID
     * @param callback A function that is passed the return arguments (error, device event)
     */
    getDeviceEvent(deviceEventId: string, callback: CallbackFn<DeviceEvent>): void;
}
