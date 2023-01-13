// Test for the pinecone-client-ts

import { PineconeClient } from '../src/index'
import { QueryRequest, CreateRequest, UpdateRequest, DeleteRequest, UpsertRequest, Vector, QueryVector, DescribeIndexStatsRequest, CreateCollectionRequest } from '../src/pinecone-generated-ts'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { generateVectors, getRandomVector, waitUntilIndexIsReady, waitUntilIndexIsTerminated } from '../utils/helpers'
import dotenv from 'dotenv'

dotenv.config()
const apiKey = process.env.API_KEY!
const environment = process.env.ENVIRONMENT!

jest.useRealTimers();

// const indexName = uniqueNamesGenerator({
//   dictionaries: [colors, adjectives, animals],
//   separator: '-',
// });

const indexName = "test"
const namespace = "test-namespace"
const collection = 'test-collection'
const dimensions = 10
const metric = 'cosine'
const vectors = generateVectors(dimensions, 2)

describe('Pinecone Client Control Plane operations', () => {
  const client: PineconeClient = new PineconeClient()

  beforeEach(() => {
    jest.setTimeout(100000)
  })

  beforeAll(async () => {
    const configuration = {
      environment,
      apiKey
    }
    await client.init(configuration)
  })

  it('should create index', async () => {
    const createRequest: CreateRequest = {
      name: indexName,
      dimension: dimensions,
      metric,
    }

    await client.createIndex(createRequest)
    await waitUntilIndexIsReady(client, indexName)
    const list = await client.listIndexes()
    expect(list.data).toContain(indexName)
  })

  it('created index should be listed', async () => {
    const list = await client.listIndexes()
    expect(list.data).toContain(indexName)
  })

  it('should be able to fetch the index description ', async () => {
    const indexDescriptionResult = await client.describeIndex(indexName)
    const { data: indexDescription } = indexDescriptionResult
    expect(indexDescription.database?.name).toEqual(indexName)
    expect(indexDescription.database?.metric).toEqual(metric)
    expect(indexDescription.database?.dimensions).toEqual(dimensions)
  })

  it('should be able to create a collection', async () => {
    const collection = 'test-collection'
    const createCollectionRequest: CreateCollectionRequest = {
      name: collection,
      source: indexName
    }
    await client.createCollection(createCollectionRequest)
    const list = await client.listCollections()
    expect(list.data).toContain(collection)
  })

  it('should be able to list collections', async () => {
    const list = await client.listCollections()
    expect(list.data).toContain(indexName)
  })

  it('should be able to describe collection', async () => {
    const collection = 'test-collection'
    const describeCollectionResult = await client.describeCollection(collection)
    const { data: describeCollection } = describeCollectionResult
    expect(describeCollection?.name).toEqual(collection)
  })

  it('should be able to delete a collection', async () => {
    const collection = 'test-collection'
    await client.deleteCollection(collection)
    const list = await client.listCollections()
    expect(list.data).not.toContain(collection)
  })

  it('should be able to delete an index', async () => {
    await client.deleteIndex(indexName)
    const list = await client.listIndexes()
    await waitUntilIndexIsTerminated(client, indexName)
    expect(list.data).not.toContain(indexName)
  })
})

describe('Pinecone Client Index Operations', () => {
  const client: PineconeClient = new PineconeClient()
  beforeEach(() => {
    jest.setTimeout(100000)
  })

  beforeAll(async () => {
    const configuration = {
      environment,
      apiKey
    }
    await client.init(configuration)
  })

  it('should create index', async () => {
    const createRequest: CreateRequest = {
      name: indexName,
      dimension: dimensions,
      metric: 'cosine',
    }

    await client.createIndex(createRequest)
    await waitUntilIndexIsReady(client, indexName)
    const list = await client.listIndexes()
    expect(list.data).toContain(indexName)
  })

  it('created index should be listed', async () => {
    const list = await client.listIndexes()
    expect(list.data).toContain(indexName)
  })

  it('should be able to upsert a vector', async () => {
    const index = client.Index(indexName)
    const upsertRequest: UpsertRequest = {
      vectors,
      namespace
    }
    await index.upsert(upsertRequest)

    const queryRequest: QueryRequest = {
      topK: 1,
      vector: getRandomVector(vectors).values,
      namespace
    }

    const queryResponse = await index.query(queryRequest)
    expect(queryResponse?.data?.matches?.length).toBeGreaterThan(0)

  })

  it('should be able to query a vector', async () => {
    const index = client.Index(indexName)
    const queryRequest: QueryRequest = {
      topK: 1,
      vector: getRandomVector(vectors).values,
      namespace
    }

    const queryResponse = await index.query(queryRequest)
    expect(queryResponse?.data?.matches?.length).toBeGreaterThan(0)
  })

  it('should be able to update a vector', async () => {
    const index = client.Index(indexName)
    const updateRequest: UpdateRequest = {
      id: getRandomVector(vectors).id,
      values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      setMetadata: {
        "foo": "bar"
      },
      namespace
    }
    await index.update(updateRequest)
    const updatedVectorResult = await index.fetch([updateRequest.id], namespace)
    const updatedVectors = updatedVectorResult?.data?.vectors as object
    const updatedVector = updatedVectors[updateRequest.id]
    expect(updatedVector.values).toEqual(updateRequest.values)
  })

  it('should be able to fetch vectors by ID', async () => {
    const index = client.Index(indexName)
    const randomVectorId = getRandomVector(vectors).id
    const fetchResult = await index.fetch([randomVectorId], namespace)
    expect(Object.keys(fetchResult.data.vectors as object)).toContain(randomVectorId)
  })

  it('should be able to delete a vector', async () => {
    const randomVectorId = getRandomVector(vectors).id
    const index = client.Index(indexName)
    await index.delete1([randomVectorId], false, namespace)
    const fetchResult = await index.fetch([randomVectorId], namespace)
    expect(Object.keys(fetchResult.data.vectors as object).length).toBe(0)
  })

  it('should be able to delete all vector in namespace', async () => {
    const index = client.Index(indexName)
    await index.delete1([], true, namespace)
    const fetchResult = await index.fetch([...vectors.map((v) => v.id)], namespace)
    expect(Object.keys(fetchResult.data.vectors as object).length).toBe(0)
  })

  afterAll(done => {
    async () => {
      await client.deleteIndex(indexName)
    }
    done()
  })
})


