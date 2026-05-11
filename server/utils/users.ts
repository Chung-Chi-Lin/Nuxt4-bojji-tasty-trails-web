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
    username: 'john',
    password: 'password123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    joinedAt: '2024-01-15',
    bio: '全端工程師，熱愛開源專案與新技術探索。',
  },
  {
    id: 2,
    username: 'jane',
    password: 'secret456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    joinedAt: '2024-03-22',
    bio: 'UI/UX 設計師兼前端開發者，專注於使用者體驗。',
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
