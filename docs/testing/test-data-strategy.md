# Test Data Strategy

## Table of Contents
1. [Overview](#overview)
2. [Test Data Sources](#test-data-sources)
3. [Data Organization](#data-organization)
4. [Data Generation](#data-generation)
5. [Data Management](#data-management)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Overview

This document outlines our strategy for managing test data across the application. Proper test data management is crucial for maintaining reliable, reproducible tests and ensuring comprehensive test coverage.

## Test Data Sources

### 1. Static Fixtures
Located in `tests/__fixtures__/`:
```typescript
// User fixture example
export const mockUsers = {
  standard: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  },
  admin: {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
};
```

### 2. Factory Functions
Located in `tests/factories/`:
```typescript
// User factory example
export function createUser(overrides = {}) {
  return {
    id: `user-${Date.now()}`,
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    role: 'user',
    ...overrides
  };
}
```

### 3. Test Databases
- Isolated test database instances
- Seeded with known test data
- Reset between test runs
- Managed through Docker containers

### 4. Mock APIs
- Consistent mock responses
- Simulated error conditions
- Network delay simulation
- Rate limiting scenarios

## Data Organization

### Directory Structure
```
tests/
├── __fixtures__/           # Static test data
│   ├── users/
│   ├── products/
│   └── orders/
├── factories/             # Data factories
│   ├── userFactory.ts
│   ├── productFactory.ts
│   └── orderFactory.ts
├── seeds/                # Database seeds
│   ├── development/
│   └── test/
└── mocks/               # API mocks
    ├── userApi.ts
    └── productApi.ts
```

### Naming Conventions
- Fixtures: `[entity].fixtures.ts`
- Factories: `[entity]Factory.ts`
- Seeds: `[entity].seed.ts`
- Mocks: `[entity].mock.ts`

## Data Generation

### 1. Factory Pattern
```typescript
// Base factory
class Factory<T> {
  private defaults: Partial<T>;

  constructor(defaults: Partial<T>) {
    this.defaults = defaults;
  }

  create(overrides: Partial<T> = {}): T {
    return {
      ...this.defaults,
      ...overrides
    } as T;
  }

  createMany(count: number, overrides: Partial<T> = {}): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// User factory implementation
class UserFactory extends Factory<User> {
  constructor() {
    super({
      id: `user-${Date.now()}`,
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      role: 'user'
    });
  }
}
```

### 2. Faker Integration
```typescript
import { faker } from '@faker-js/faker';

export function createRandomUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['user', 'admin', 'manager'])
  };
}
```

### 3. Seeding Strategy
```typescript
// Database seeder
export class TestDatabaseSeeder {
  async seed() {
    await this.seedUsers();
    await this.seedProducts();
    await this.seedOrders();
  }

  private async seedUsers() {
    const users = new UserFactory().createMany(10);
    await db.users.createMany(users);
  }

  private async seedProducts() {
    const products = new ProductFactory().createMany(20);
    await db.products.createMany(products);
  }

  private async seedOrders() {
    const orders = new OrderFactory().createMany(5);
    await db.orders.createMany(orders);
  }
}
```

## Data Management

### 1. Data Isolation
```typescript
describe('UserService', () => {
  let testDb: TestDatabase;

  beforeEach(async () => {
    testDb = await TestDatabase.create();
    await testDb.migrate();
    await testDb.seed();
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  // Tests...
});
```

### 2. Data Cleanup
```typescript
// Database cleanup utility
export class DatabaseCleanup {
  static async cleanup() {
    await Promise.all([
      db.users.deleteMany(),
      db.products.deleteMany(),
      db.orders.deleteMany()
    ]);
  }

  static async resetSequences() {
    await db.$executeRaw`
      SELECT setval('"users_id_seq"', 1, false);
      SELECT setval('"products_id_seq"', 1, false);
      SELECT setval('"orders_id_seq"', 1, false);
    `;
  }
}
```

### 3. Version Control
- Track test data changes in git
- Document data schema changes
- Maintain backwards compatibility
- Version test data alongside code

## Best Practices

### 1. Data Independence
- Each test should be self-contained
- Avoid shared mutable state
- Reset data between tests
- Use unique identifiers

### 2. Data Relevance
- Use minimal data sets
- Create data specific to test cases
- Avoid unnecessary data
- Document data requirements

### 3. Data Maintenance
- Regular cleanup of unused data
- Update test data with schema changes
- Remove obsolete fixtures
- Keep documentation current

### 4. Performance Considerations
- Optimize data generation
- Use bulk operations
- Cache common test data
- Parallelize data setup

## Examples

### 1. Complete Test Setup Example

```typescript
import { TestDatabase } from './utils/TestDatabase';
import { UserFactory } from './factories/UserFactory';
import { ProductFactory } from './factories/ProductFactory';
import { mockUserApi } from './mocks/userApi';

describe('OrderService', () => {
  let testDb: TestDatabase;
  let users: User[];
  let products: Product[];

  beforeAll(async () => {
    testDb = await TestDatabase.create();
    await testDb.migrate();
  });

  beforeEach(async () => {
    // Create test data
    users = await new UserFactory().createMany(2);
    products = await new ProductFactory().createMany(3);

    // Seed database
    await testDb.users.createMany(users);
    await testDb.products.createMany(products);

    // Setup API mocks
    mockUserApi.setup();
  });

  afterEach(async () => {
    await testDb.cleanup();
    mockUserApi.reset();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  it('should create an order with valid data', async () => {
    const orderData = {
      userId: users[0].id,
      productIds: [products[0].id, products[1].id]
    };

    const order = await orderService.createOrder(orderData);

    expect(order).toBeDefined();
    expect(order.userId).toBe(users[0].id);
    expect(order.products).toHaveLength(2);
  });
});
```

### 2. API Mock Example

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockUserApi = {
  server: setupServer(
    rest.get('/api/users/:id', (req, res, ctx) => {
      const { id } = req.params;
      return res(
        ctx.json({
          id,
          name: 'Test User',
          email: 'test@example.com'
        })
      );
    }),

    rest.post('/api/users', (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({
          id: 'new-user-id',
          ...req.body
        })
      );
    })
  ),

  setup() {
    this.server.listen();
  },

  reset() {
    this.server.resetHandlers();
  },

  close() {
    this.server.close();
  }
};
```

### 3. Database Seeding Example

```typescript
import { PrismaClient } from '@prisma/client';
import { UserFactory } from './factories/UserFactory';
import { ProductFactory } from './factories/ProductFactory';

export class TestSeeder {
  constructor(private prisma: PrismaClient) {}

  async seed() {
    // Create test users
    const users = await this.prisma.user.createMany({
      data: new UserFactory().createMany(10)
    });

    // Create test products
    const products = await this.prisma.product.createMany({
      data: new ProductFactory().createMany(20)
    });

    // Create test orders
    const orders = await Promise.all(
      users.map(user =>
        this.prisma.order.create({
          data: {
            userId: user.id,
            products: {
              connect: products
                .slice(0, 3)
                .map(product => ({ id: product.id }))
            }
          }
        })
      )
    );

    return {
      users,
      products,
      orders
    };
  }
} 