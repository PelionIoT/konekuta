"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var group_1 = require("./group");
/**
 * Group Adapter
 */
var GroupAdapter = (function () {
    function GroupAdapter() {
    }
    GroupAdapter.map = function (from, api) {
        return new group_1.Group({
            id: from.id,
            accountId: from.account_id,
            name: from.name,
            userCount: from.user_count,
            apiKeyCount: from.apikey_count,
            createdAt: from.created_at,
            creationTime: from.creation_time,
            lastUpdateTime: from.last_update_time
        }, api);
    };
    return GroupAdapter;
}());
exports.GroupAdapter = GroupAdapter;
