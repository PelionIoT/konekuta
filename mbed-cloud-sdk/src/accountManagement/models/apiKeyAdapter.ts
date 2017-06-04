/*
* mbed Cloud JavaScript SDK
* Copyright ARM Limited 2017
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import {
    ApiKeyInfoReq as apiApiKeyAdd,
    ApiKeyUpdateReq as apiApiKeyUpdate,
    ApiKeyInfoResp as apiApiKey
} from "../../_api/iam";
import { AddApiKeyObject, UpdateApiKeyObject } from "../types";
import { AccountManagementApi } from "../accountManagementApi";
import { ApiKey } from "./apiKey";

/**
 * API Key Adapter
 */
export class ApiKeyAdapter {

    static map(from: apiApiKey, api: AccountManagementApi): ApiKey {
        return new ApiKey({
            name             : from.name,
            owner            : from.owner,
            groups           : from.groups,
            id               : from.id,
            key              : from.key,
            status           : from.status,
            createdAt        : from.created_at,
            creationTime     : from.creation_time,
            lastLoginTime    : from.last_login_time
        }, api);
    }

    static addMap(from: AddApiKeyObject): apiApiKeyAdd {
        return {
            name:      from.name,
            owner:     from.owner,
        };
    }

    static updateMap(from: UpdateApiKeyObject): apiApiKeyUpdate {
        return {
            name:      from.name,
            owner:     from.owner,
        };
    }
}