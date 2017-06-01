import { ConnectionOptions, CallbackFn, ListOptions, ListResponse } from "../common/interfaces";
import { UpdateAccountObject, AddApiKeyObject, UpdateApiKeyObject, AddUserObject, UpdateUserObject, ApiKeyListOptions, UserListOptions } from "./types";
import { Account } from "./models/account";
import { ApiKey } from "./models/apiKey";
import { User } from "./models/user";
import { Group } from "./models/group";
/**
 * ## Account Management API
 *
 * This API is initialized with [ConnectionOptions](../interfaces/connectionoptions.html).
 *
 * To create an instance of this API in [Node.js](https://nodejs.org):
 *
 * ```JavaScript
 * var mbedCloudSDK = require("mbed-cloud-sdk");
 *
 * var accounts = new mbedCloudSDK.AccountManagementApi({
 *     apiKey: "<mbed Cloud API Key>"
 * });
 * ```
 *
 * To create an instance of this API in the browser:
 *
 * ```html
 * <script src="<mbed-cloud-sdk>/bundles/account-management.min.js"></script>
 *
 * <script>
 *     var accounts = new mbedCloudSDK.AccountManagementApi({
 *         apiKey: "<mbed Cloud API Key>"
 *     });
 * </script>
 * ```
 */
export declare class AccountManagementApi {
    private _endpoints;
    /**
    * @param options connection options
    */
    constructor(options: ConnectionOptions);
    /**
     * Get details of account associated with current API key
     * @returns Promise of account
     */
    getAccount(): Promise<Account>;
    /**
     * Get details of account associated with current API key
     * @param callback A function that is passed the return arguments (error, account)
     */
    getAccount(callback: CallbackFn<Account>): void;
    /**
     * Update details of account associated with current API key
     * @param account The account object to update
     * @returns Promise of account
     */
    updateAccount(account: UpdateAccountObject): Promise<Account>;
    /**
     * Update details of account associated with current API key
     * @param account The account object to update
     * @param callback A function that is passed the return arguments (error, account)
     */
    updateAccount(account: UpdateAccountObject, callback?: CallbackFn<Account>): void;
    /**
     * List API keys
     * @param options filter options
     * @returns Promise of listResponse
     */
    listApiKeys(options?: ApiKeyListOptions): Promise<ListResponse<ApiKey>>;
    /**
     * List API keys
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listApiKeys(options?: ApiKeyListOptions, callback?: CallbackFn<ListResponse<ApiKey>>): void;
    /**
     * Get details of an API key
     * @param apiKeyId The API key ID (if not specified, returns current API key)
     * @returns Promise containing the API key
     */
    getApiKey(apiKeyId?: string): Promise<ApiKey>;
    /**
     * Get details of an API key
     * @param apiKeyId The API key ID (if not specified, returns current API key)
     * @param callback A function that is passed the return arguments (error, API key)
     */
    getApiKey(apiKeyId?: string, callback?: CallbackFn<ApiKey>): void;
    /**
     * Adds an API key
     * @param apiKey The API key to add
     * @returns Promise containing API key
     */
    addApiKey(apiKey: AddApiKeyObject): Promise<ApiKey>;
    /**
     * Adds an API key
     * @param apiKey The API key to add
     * @param callback A function that is passed the return arguments (error, API key)
     */
    addApiKey(apiKey: AddApiKeyObject, callback: CallbackFn<ApiKey>): void;
    /**
     * Updates an API key
     * @param apiKey The API key to add
     * @returns Promise containing API key
     */
    updateApiKey(apiKey: UpdateApiKeyObject): Promise<ApiKey>;
    /**
     * Updates an API key
     * @param apiKey The API key to add
     * @param callback A function that is passed the return arguments (error, API key)
     */
    updateApiKey(apiKey: UpdateApiKeyObject, callback: CallbackFn<ApiKey>): void;
    /**
     * Deletes an API key
     * @param apiKeyId The API key ID
     * @returns Promise containing any error
     */
    deleteApiKey(apiKeyId: string): Promise<void>;
    /**
     * Deletes an API key
     * @param apiKeyId The API key ID
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteApiKey(apiKeyId: string, callback: CallbackFn<void>): void;
    /**
     * List users
     * @param options filter options
     * @returns Promise of listResponse
     */
    listUsers(options?: UserListOptions): Promise<ListResponse<User>>;
    /**
     * List users
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listUsers(options?: UserListOptions, callback?: CallbackFn<ListResponse<User>>): void;
    /**
     * Get details of a user
     * @param userId The user ID
     * @returns Promise containing the user
     */
    getUser(userId: string): Promise<User>;
    /**
     * Get details of a user
     * @param userId The user ID
     * @param callback A function that is passed the return arguments (error, user)
     */
    getUser(userId: string, callback: CallbackFn<User>): void;
    /**
     * Adds a user
     * @param user User to add
     * @returns Promise containing user
     */
    addUser(user: AddUserObject): Promise<User>;
    /**
     * Adds a user
     * @param user User to add
     * @param callback A function that is passed the return arguments (error, user)
     */
    addUser(user: AddUserObject, callback: CallbackFn<User>): void;
    /**
     * Updates a user
     * @param user User to update
     * @returns Promise containing user
     */
    updateUser(user: UpdateUserObject): Promise<User>;
    /**
     * Updates a user
     * @param user User to update
     * @param callback A function that is passed the return arguments (error, user)
     */
    updateUser(user: UpdateUserObject, callback: CallbackFn<User>): void;
    /**
     * Deletes a user
     * @param userId The user ID
     * @returns Promise containing any error
     */
    deleteUser(userId: string): Promise<void>;
    /**
     * Deletes a user
     * @param userId The user ID
     * @param callback A function that is passed the return arguments (error, void)
     */
    deleteUser(userId: string, callback: CallbackFn<void>): void;
    /**
     * List groups
     * @param options filter options
     * @returns Promise of listResponse
     */
    listGroups(options?: ListOptions): Promise<ListResponse<Group>>;
    /**
     * List groups
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listGroups(options?: ListOptions, callback?: CallbackFn<ListResponse<Group>>): void;
    /**
     * Get details of a group
     * @param groupId The group ID
     * @returns Promise containing the group
     */
    getGroup(groupId: string): Promise<Group>;
    /**
     * Get details of a group
     * @param groupId The group ID
     * @param callback A function that is passed the arguments (error, group)
     */
    getGroup(groupId: string, callback: CallbackFn<Group>): void;
    /**
     * List users of a group
     * @param groupId The group ID
     * @param options filter options
     * @returns Promise of listResponse
     */
    listGroupUsers(groupId: string, options?: ListOptions): Promise<ListResponse<User>>;
    /**
     * List users of a group
     * @param groupId The group ID
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listGroupUsers(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<User>>): void;
    /**
     * List API keys of a group
     * @param groupId The group ID
     * @param options filter options
     * @returns Promise of listResponse
     */
    listGroupApiKeys(groupId: string, options?: ListOptions): Promise<ListResponse<ApiKey>>;
    /**
     * List API keys of a group
     * @param groupId The group ID
     * @param options filter options
     * @param callback A function that is passed the arguments (error, listResponse)
     */
    listGroupApiKeys(groupId: string, options?: ListOptions, callback?: CallbackFn<ListResponse<ApiKey>>): void;
}
