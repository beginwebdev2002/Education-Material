function hashUserId(userId: string): number {
  let sum = 0;
  for (const char of userId) {
    sum += char.charCodeAt(0);
  }
  return sum;
}

export function getMockMaterialsCount(userId: string): number {
  return (hashUserId(userId) % 10) * 2 + 1;
}

export function getMockLastSignin(userId: string): Date {
  const offset = hashUserId(userId) % 30;
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date;
}
