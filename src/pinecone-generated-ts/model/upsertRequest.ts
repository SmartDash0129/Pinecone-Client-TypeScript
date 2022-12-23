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

import { RequestFile } from './models';
import { Vector } from './vector';

/**
* The request for the `Upsert` operation.
*/
export class UpsertRequest {
    /**
    * An array containing the vectors to upsert. Recommended batch limit is 100 vectors.
    */
    'vectors': Array<Vector>;
    /**
    * This is the namespace name where you upsert vectors.
    */
    'namespace'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "vectors",
            "baseName": "vectors",
            "type": "Array<Vector>"
        },
        {
            "name": "namespace",
            "baseName": "namespace",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return UpsertRequest.attributeTypeMap;
    }
}

