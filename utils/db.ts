import { sql } from '@vercel/postgres';

export async function storeUser(name: string, email: string) {
  try {
    await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) 
      DO UPDATE SET name = ${name}, last_interaction = CURRENT_TIMESTAMP
    `;
    console.log(`User ${name} stored/updated successfully`);
  } catch (error) {
    console.error('Error storing user:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateLastInteraction(email: string) {
  try {
    await sql`
      UPDATE users
      SET last_interaction = CURRENT_TIMESTAMP
      WHERE email = ${email}
    `;
    console.log(`Last interaction updated for user with email ${email}`);
  } catch (error) {
    console.error('Error updating last interaction:', error);
    throw error;
  }
}
