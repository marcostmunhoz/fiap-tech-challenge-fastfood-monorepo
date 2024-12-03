import { test as setup, expect } from "@playwright/test";
import { generate } from "gerador-validador-cpf";
import { saveStorage } from "../storage";
import { faker } from "@faker-js/faker";

const AUTH_FN_BASE_URL = process.env.AUTH_FN_BASE_URL as string;

setup("authenticate user", async ({ request }) => {
  // Arrange
  const cpf = generate();
  const email = faker.internet.exampleEmail();
  const name = faker.person.fullName();

  // Act
  const response = await request.post(AUTH_FN_BASE_URL, {
    data: { cpf, email, name },
  });
  const { token }: { token: string } = await response.json();

  // Assert
  await expect(token).toBeTruthy();
  saveStorage("auth", { cpf, email, name, token });
});
