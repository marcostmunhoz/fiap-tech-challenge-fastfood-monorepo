import { test as setup, expect } from "@playwright/test";
import { saveStorage } from "../storage";
import { faker } from "@faker-js/faker";

const KITCHEN_MS_BASE_URL = process.env.KITCHEN_MS_BASE_URL as string;

setup("create products", async ({ request }) => {
  // Arrange
  const products = [
    {
      code: `PLAYWRIGHT-${faker.number.int({ min: 1, max: 1000 })}`,
      name: "Product 1",
      description: "Product 1 Description",
      price: 10.99,
      category: "food",
    },
    {
      code: `PLAYWRIGHT-${faker.number.int({ min: 1, max: 1000 })}`,
      name: "Product 2",
      description: "Product 2 Description",
      price: 20.99,
      category: "side",
    },
  ];

  // Act
  const response1 = await request.post(
    `${KITCHEN_MS_BASE_URL}/api/v1/products`,
    {
      data: { ...products[0] },
    }
  );
  const product1 = await response1.json();
  const response2 = await request.post(
    `${KITCHEN_MS_BASE_URL}/api/v1/products`,
    {
      data: { ...products[1] },
    }
  );
  const product2 = await response2.json();

  // Assert
  await expect(response1.status()).toBe(201);
  await expect(response2.status()).toBe(201);
  await expect(product1.id).not.toBeUndefined();
  await expect(product2.id).not.toBeUndefined();
  saveStorage("kitchen", { product1, product2 });
});
