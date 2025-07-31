import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as request from 'supertest';
import { ProductModule } from './product.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('ProductResolver Integration (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: true,
          introspection: true,
        }),
        PrismaModule,
        ProductModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should introspect GraphQL schema', async () => {
    const query = `
      {
        __schema {
          types {
            name
            fields {
              name
              type {
                name
              }
            }
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    // Check that our new types exist in the schema
    const types = response.body.data.__schema.types;
    const typeNames = types.map((type: any) => type.name);

    expect(typeNames).toContain('Product');
    expect(typeNames).toContain('ProductImage');
    expect(typeNames).toContain('ProductAttribute');
    expect(typeNames).toContain('ProductVariation');
    expect(typeNames).toContain('ProductVariationAttribute');
    expect(typeNames).toContain('AttributeType');
  });

  it('should expose product image mutations', async () => {
    const query = `
      {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const mutations = response.body.data.__schema.mutationType.fields;
    const mutationNames = mutations.map((field: any) => field.name);

    expect(mutationNames).toContain('createProductImage');
    expect(mutationNames).toContain('updateProductImage');
    expect(mutationNames).toContain('deleteProductImage');
    expect(mutationNames).toContain('setDefaultProductImage');
  });

  it('should expose product attribute mutations', async () => {
    const query = `
      {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const mutations = response.body.data.__schema.mutationType.fields;
    const mutationNames = mutations.map((field: any) => field.name);

    expect(mutationNames).toContain('createProductAttribute');
    expect(mutationNames).toContain('updateProductAttribute');
    expect(mutationNames).toContain('deleteProductAttribute');
  });

  it('should expose product variation mutations', async () => {
    const query = `
      {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const mutations = response.body.data.__schema.mutationType.fields;
    const mutationNames = mutations.map((field: any) => field.name);

    expect(mutationNames).toContain('createProductVariation');
    expect(mutationNames).toContain('updateProductVariation');
    expect(mutationNames).toContain('deleteProductVariation');
    expect(mutationNames).toContain('updateVariationStock');
  });

  it('should expose enhanced product queries', async () => {
    const query = `
      {
        __schema {
          queryType {
            fields {
              name
            }
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const queries = response.body.data.__schema.queryType.fields;
    const queryNames = queries.map((field: any) => field.name);

    expect(queryNames).toContain('productWithDetails');
    expect(queryNames).toContain('productsWithDetails');
    expect(queryNames).toContain('productImages');
    expect(queryNames).toContain('productAttributes');
    expect(queryNames).toContain('productVariations');
  });
});