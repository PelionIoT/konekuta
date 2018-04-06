import { DeviceEvent } from "./deviceEvent";
import { DeviceEventData as apiDeviceEvent } from "../../_api/device_catalog";
/**
 * Device Event Adapter
 */
export declare class DeviceEventAdapter {
    static map(from: apiDeviceEvent): DeviceEvent;
}
