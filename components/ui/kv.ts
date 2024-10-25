import { kv } from '@vercel/kv';

export async function setValue(key: string, value: any) {
  try {
    await kv.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting value in KV:', error);
  }
}

export async function getValue(key: string) {
  try {
    const value = await kv.get(key);
    return value ? JSON.parse(value as string) : null;
  } catch (error) {
    console.error('Error getting value from KV:', error);
    return null;
  }
}
