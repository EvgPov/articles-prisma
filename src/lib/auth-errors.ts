const FALLBACK_MESSAGE = "Что-то пошло не так. Попробуйте ещё раз";

const MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Пользователь с такой почтой уже зарегистрирован",
  INVALID_EMAIL_OR_PASSWORD: "Неверная почта или пароль",
  PASSWORD_TOO_SHORT: "Пароль слишком короткий: нужно не меньше 8 символов",
  INVALID_EMAIL: "Некорректный адрес почты",
};

export function authErrorMessage(code: string | undefined) {
  if (!code) return FALLBACK_MESSAGE;
  return MESSAGES[code] ?? FALLBACK_MESSAGE;
}
