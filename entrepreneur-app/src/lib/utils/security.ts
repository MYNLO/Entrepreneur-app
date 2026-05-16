export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function rateLimitCheck(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const stored = localStorage.getItem(`rl_${key}`);
  const attempts = stored ? JSON.parse(stored) : [];
  const valid = attempts.filter((t: number) => now - t < windowMs);

  if (valid.length >= maxAttempts) return false;

  valid.push(now);
  localStorage.setItem(`rl_${key}`, JSON.stringify(valid));
  return true;
}