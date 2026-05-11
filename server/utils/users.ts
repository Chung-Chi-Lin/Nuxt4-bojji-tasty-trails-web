export interface User {
  id: number
  username: string
  password: string
  name: string
  email: string
  role: string
  joinedAt: string
  bio: string
}

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: '77',
    password: 'Z1030413z',
    name: '77',
    email: '',
    role: 'Admin',
    joinedAt: '2025-05-07',
    bio: '',
  },
  {
    id: 2,
    username: 'ruru',
    password: 'Z1030413z',
    name: 'Ruru',
    email: '',
    role: 'Editor',
    joinedAt: '2025-05-07',
    bio: '',
  },
]

// In-memory token store (maps token → userId)
export const tokenStore = new Map<string, number>()

export function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getUserByToken(token: string): Omit<User, 'password'> | null {
  const userId = tokenStore.get(token)
  if (!userId) return null
  const user = MOCK_USERS.find((u) => u.id === userId)
  if (!user) return null
  const { password: _, ...safeUser } = user
  return safeUser
}
