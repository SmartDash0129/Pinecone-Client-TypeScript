/* tslint:disable */
/* eslint-disable */
/**
 * Pinecone API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: version not set
 * Contact: support@pinecone.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * A summary of the contents of a namespace.
 * @export
 * @interface NamespaceSummary
 */
export interface NamespaceSummary {
    /**
     * The number of vectors stored in this namespace. Note that updates to this field may lag behind updates to the
     * underlying index and corresponding query results, etc.
     * @type {number}
     * @memberof NamespaceSummary
     */
    vectorCount?: number;
}

/**
 * Check if a given object implements the NamespaceSummary interface.
 */
export function instanceOfNamespaceSummary(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function NamespaceSummaryFromJSON(json: any): NamespaceSummary {
    return NamespaceSummaryFromJSONTyped(json, false);
}

export function NamespaceSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): NamespaceSummary {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'vectorCount': !exists(json, 'vectorCount') ? undefined : json['vectorCount'],
    };
}

export function NamespaceSummaryToJSON(value?: NamespaceSummary | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'vectorCount': value.vectorCount,
    };
}

