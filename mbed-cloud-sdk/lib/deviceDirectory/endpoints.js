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
var mds_1 = require("../_api/mds");
var device_catalog_1 = require("../_api/device_catalog");
var device_query_service_1 = require("../_api/device_query_service");
var Endpoints = (function () {
    function Endpoints(options) {
        this.webhooks = new mds_1.DefaultApi(options.apiKey, options.host);
        this.endpoints = new mds_1.EndpointsApi(options.apiKey, options.host);
        this.notifications = new mds_1.NotificationsApi(options.apiKey, options.host);
        this.resources = new mds_1.ResourcesApi(options.apiKey, options.host);
        this.subscriptions = new mds_1.SubscriptionsApi(options.apiKey, options.host);
        this.catalog = new device_catalog_1.DefaultApi(options.apiKey, options.host);
        this.query = new device_query_service_1.DefaultApi(options.apiKey, options.host);
    }
    return Endpoints;
}());
exports.Endpoints = Endpoints;