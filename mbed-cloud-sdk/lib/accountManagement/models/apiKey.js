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
var functions_1 = require("../../common/functions");
/**
 * API Key
 */
var ApiKey = (function () {
    function ApiKey(init, _api) {
        this._api = _api;
        for (var key in init) {
            this[key] = init[key];
        }
    }
    ApiKey.prototype.listGroups = function (callback) {
        var _this = this;
        return functions_1.apiWrapper(function (resultsFn) {
            _this._api.listGroups(resultsFn);
        }, function (data, done) {
            var groups = [];
            if (data.data && data.data.length) {
                groups = data.data.filter(function (group) {
                    return _this.groups.indexOf(group.id) > -1;
                });
            }
            done(null, groups);
        }, callback);
    };
    ApiKey.prototype.getOwner = function (callback) {
        var _this = this;
        return functions_1.asyncStyle(function (done) {
            if (!_this.owner)
                return done(null, null);
            _this._api.getUser(_this.owner, done);
        }, callback);
    };
    ApiKey.prototype.update = function (callback) {
        var _this = this;
        return functions_1.asyncStyle(function (done) {
            _this._api.updateApiKey(_this, done);
        }, callback);
    };
    ApiKey.prototype.delete = function (callback) {
        var _this = this;
        return functions_1.asyncStyle(function (done) {
            _this._api.deleteApiKey(_this.id, done);
        }, callback);
    };
    return ApiKey;
}());
exports.ApiKey = ApiKey;
