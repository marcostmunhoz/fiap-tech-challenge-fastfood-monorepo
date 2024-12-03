import { test, expect, APIRequestContext } from "@playwright/test";
import { restoreStorage } from "../storage";

const ORDER_MS_BASE_URL = process.env.ORDER_MS_BASE_URL as string;

const createOrder = async (request: APIRequestContext): Promise<string> => {
  const { token } = await restoreStorage<{ token: string }>("auth");
  const { product1 } = await restoreStorage<{
    product1: { code: string; price: number };
  }>("kitchen");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const createOrderResponse = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders`,
    { headers }
  );
  const { id } = await createOrderResponse.json();
  await request.post(`${ORDER_MS_BASE_URL}/api/v1/orders/${id}/add-item`, {
    data: { productCode: product1.code, quantity: 1 },
    headers,
  });

  return id;
};

test("show order", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const { id, total } = await restoreStorage<{ id: string; total: number }>(
    "order"
  );

  // Act
  const response = await request.get(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const order = await response.json();

  // Assert
  await expect(response.status()).toBe(200);
  await expect(order.id).toEqual(id);
  await expect(order.total).toEqual(total);
  await expect(order.status).toEqual("pending");
  await expect(order.items).toHaveLength(2);
});

test("change order item quantity", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const { product1 } = await restoreStorage<{ product1: { code: string } }>(
    "kitchen"
  );
  const id = await createOrder(request);

  // Act
  const response = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/change-item-quantity`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        productCode: product1.code,
        quantity: 3,
      },
    }
  );

  // Assert
  await expect(response.status()).toBe(204);
});

test("remove order item", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const { product1, product2 } = await restoreStorage<{
    product1: { code: string };
    product2: { code: string };
  }>("kitchen");
  const id = await createOrder(request);

  // Act
  await request.post(`${ORDER_MS_BASE_URL}/api/v1/orders/${id}/add-item`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      productCode: product2.code,
      quantity: 1,
    },
  });
  const response = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/remove-item`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        productCode: product1.code,
      },
    }
  );

  // Assert
  await expect(response.status()).toBe(204);
});

test('mark order as "paid"', async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const id = await createOrder(request);

  // Act
  const response = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/change-status`,
    {
      data: {
        status: "paid",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Assert
  await expect(response.status()).toBe(204);
});

test('mark order as "canceled"', async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const id = await createOrder(request);

  // Act
  const response = await request.post(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}/change-status`,
    {
      data: {
        status: "canceled",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Assert
  await expect(response.status()).toBe(204);
});
