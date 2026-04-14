import { Request } from 'express';

export function getParam(req: Request, key: string): string {
  const value = req.params[key];
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  throw new Error(`Missing required route param: ${key}`);
}
