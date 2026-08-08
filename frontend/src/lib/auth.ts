export type UserRole = 'candidate' | 'interviewer'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

const STORAGE_KEY = 'interviewpro-auth'

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as AuthUser) : null
  } catch {
    return null
  }
}

export function signIn(email: string, role: UserRole): AuthUser {
  const user: AuthUser = { id: role === 'candidate' ? 'alex-morgan' : 'maya-chen', name: role === 'candidate' ? 'Alex Morgan' : 'Maya Chen', email: email || (role === 'candidate' ? 'alex@example.com' : 'maya@interviewpro.com'), role }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export function signOut() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function demoUser(role: UserRole) {
  return signIn(role === 'candidate' ? 'alex@example.com' : 'maya@interviewpro.com', role)
}

export function canAccess(user: AuthUser | null, role: UserRole) {
  return Boolean(user && user.role === role)
}

export function redirectForRole(role: UserRole) {
  return role === 'candidate' ? '/candidate/dashboard' : '/interviewer/dashboard'
}

export const authStorageKey = STORAGE_KEY
