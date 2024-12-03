import { test as setup, expect } from "@playwright/test";
import { restoreStorage, saveStorage } from "../storage";

const ORDER_MS_BASE_URL = process.env.ORDER_MS_BASE_URL as string;

setup("create pending order", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const { product1, product2 } = await restoreStorage<{
    product1: { code: string; price: number };
    product2: { code: string; price: number };
  }>("kitchen");
  const total = product1.price + product2.price * 2;

  // Act
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const createOrderResponse = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders`,
    { headers }
  );
  const { id } = await createOrderResponse.json();
  const addOrderItemResponse1 = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/add-item`,
    {
      data: { productCode: product1.code, quantity: 1 },
      headers,
    }
  );
  const addOrderItemResponse2 = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/add-item`,
    {
      data: { productCode: product2.code, quantity: 2 },
      headers,
    }
  );

  // Assert
  await expect(createOrderResponse.status()).toBe(201);
  await expect(addOrderItemResponse1.status()).toBe(204);
  await expect(addOrderItemResponse2.status()).toBe(204);
  saveStorage("order", { id, total });
});
