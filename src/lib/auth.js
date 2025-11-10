import { rpc } from './nodeBridge';

export async function login(email, password) {
  const res = await rpc('login', { email, password });
  if (!res.ok) { throw new Error(res.message || 'Login failed'); }
  return res.user;
}

export async function register(email, password, userType) {
  const res = await rpc('register', { email, password, user_type: userType });
  if (!res.ok) { throw new Error(res.message || 'Registration failed'); }
  return res.user;
}
