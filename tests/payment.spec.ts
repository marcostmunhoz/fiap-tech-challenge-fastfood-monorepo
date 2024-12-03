import { test, expect, APIRequestContext } from "@playwright/test";
import { restoreStorage } from "../storage";

const PAYMENT_MS_BASE_URL = process.env.PAYMENT_MS_BASE_URL as string;
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

test("credit card payment", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const id = await createOrder(request);

  // Act
  const paymentResponse = await request.post(
    `${PAYMENT_MS_BASE_URL}/api/v1/payments`,
    {
      data: {
        orderId: id,
        paymentMethod: "credit-card",
        cardData: {
          number: "1111222233334444",
          expiration: "12/30",
          verificationCode: "111",
        },
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const orderResponse = await request.get(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const order = await orderResponse.json();

  // Assert
  await expect(paymentResponse.status()).toBe(201);
  await expect(order.status).toEqual("paid");
});

test("pix payment", async ({ request }) => {
  // Arrange
  const { token } = await restoreStorage<{ token: string }>("auth");
  const id = await createOrder(request);

  // Act
  const paymentResponse = await request.post(
    `${PAYMENT_MS_BASE_URL}/api/v1/payments`,
    {
      data: {
        orderId: id,
        paymentMethod: "pix",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { id: paymentId } = await paymentResponse.json();
  const refreshPaymentStatusResponse = await request.post(
    `${PAYMENT_MS_BASE_URL}/api/v1/payments/${paymentId}/refresh-status`
  );
  const { status: paymentStatus } = await refreshPaymentStatusResponse.json();
  const orderResponse = await request.get(
    `${ORDER_MS_BASE_URL}/api/v1/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const order = await orderResponse.json();

  // Assert
  await expect(paymentResponse.status()).toBe(201);
  await expect(refreshPaymentStatusResponse.status()).toBe(200);
  await expect(paymentStatus).toEqual("paid");
  await expect(order.status).toEqual("paid");
});
