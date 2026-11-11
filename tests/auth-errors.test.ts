import { describe, expect, it } from "vitest";
import { authErrorMessage } from "@/lib/auth-errors";

describe("authErrorMessage", () => {
  it.each([
    [undefined, "Что-то пошло не так. Попробуйте ещё раз"],
    ["SOMETHING_ELSE", "Что-то пошло не так. Попробуйте ещё раз"],
    [
      "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
      "Пользователь с такой почтой уже зарегистрирован",
    ],
    ["INVALID_EMAIL_OR_PASSWORD", "Неверная почта или пароль"],
    [
      "PASSWORD_TOO_SHORT",
      "Пароль слишком короткий: нужно не меньше 8 символов",
    ],
    ["INVALID_EMAIL", "Некорректный адрес почты"],
  ])("map %j to %j", (input, expected) => {
    expect(authErrorMessage(input)).toBe(expected);
  });
});
