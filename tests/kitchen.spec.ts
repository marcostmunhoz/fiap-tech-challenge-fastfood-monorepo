import { test, expect, APIRequestContext } from "@playwright/test";
import { restoreStorage } from "../storage";
import { faker } from "@faker-js/faker";

const KITCHEN_MS_BASE_URL = process.env.KITCHEN_MS_BASE_URL as string;

test("show product", async ({ request }) => {
  // Arrange
  const kitchenStorage = await restoreStorage<{ product1: any }>("kitchen");
  const product1 = kitchenStorage?.product1;

  // Act
  const response = await request.get(
    `${KITCHEN_MS_BASE_URL}/api/v1/products/${product1.id}`
  );
  const product = await response.json();

  // Assert
  await expect(response.status()).toBe(200);
  await expect(product.code).toEqual(product1.code);
  await expect(product.name).toEqual(product1.name);
  await expect(product.description).toEqual(product1.description);
  await expect(product.price).toEqual(product1.price);
  await expect(product.category).toEqual(product1.category);
});

test("search product", async ({ request }) => {
  // Arrange
  const kitchenStorage = await restoreStorage<{ product1: any }>("kitchen");
  const product1 = kitchenStorage?.product1;

  // Act
  const response = await request.get(
    `${KITCHEN_MS_BASE_URL}/api/v1/products?query=${product1.code}&category=${product1.category}`
  );
  const products = await response.json();

  // Assert
  await expect(response.status()).toBe(200);
  await expect(products).toHaveLength(1);
  await expect(products[0].id).toEqual(product1.id);
});

test("edit product", async ({ request }) => {
  // Arrange
  const data = {
    code: `PLAYWRIGHT-${faker.number.int({ min: 1, max: 1000 })}`,
    name: "Product 1",
    description: "Product 1 Description",
    price: 10.99,
    category: "food",
  };
  const createdProductResponse = await request.post(
    `${KITCHEN_MS_BASE_URL}/api/v1/products`,
    { data }
  );
  const { id } = await createdProductResponse.json();

  // Act
  const response = await request.put(
    `${KITCHEN_MS_BASE_URL}/api/v1/products/${id}`,
    {
      data: {
        code: `PLAYWRIGHT-${faker.number.int({ min: 1, max: 1000 })}`,
        name: "Product 1 Updated",
        description: "Product 1 Description Updated",
        price: 15.99,
        category: "food",
      },
    }
  );

  // Assert
  await expect(response.status()).toBe(204);
});

test("delete product", async ({ request }) => {
  // Arrange
  const data = {
    code: `PLAYWRIGHT-${faker.number.int({ min: 1, max: 1000 })}`,
    name: "Product 1",
    description: "Product 1 Description",
    price: 10.99,
    category: "food",
  };
  const createdProductResponse = await request.post(
    `${KITCHEN_MS_BASE_URL}/api/v1/products`,
    { data }
  );
  const { id } = await createdProductResponse.json();

  // Act
  const response = await request.delete(
    `${KITCHEN_MS_BASE_URL}/api/v1/products/${id}`
  );

  // Assert
  await expect(response.status()).toBe(204);
});
