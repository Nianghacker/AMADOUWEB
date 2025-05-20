"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// Types pour l'authentification
export type User = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  isGuest?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserProfile: (userData: Partial<User>) => void
  continueAsGuest: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  continueAsGuest: () => {},
})

export const useAuth = () => useContext(AuthContext)

// Simuler une base de données d'utilisateurs
const DEMO_USERS = [
  {
    id: "1",
    name: "Sophie Martin",
    email: "sophie@example.com",
    password: "password123", // Dans une vraie application, les mots de passe seraient hachés
    phone: "06 12 34 56 78",
    address: "123 Avenue des Champs-Élysées, 75008 Paris, France",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        const storedGuestUser = localStorage.getItem("guestUser")

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
        } else if (storedGuestUser) {
          setUser(JSON.parse(storedGuestUser))
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Vérifier les identifiants
      const foundUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        })
        return false
      }

      // Créer un utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = foundUser

      // Stocker l'utilisateur et le token
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("token", "demo-token-" + Date.now()) // Simuler un token

      setUser(userWithoutPassword)

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${foundUser.name} !`,
      })

      return true
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction d'inscription
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Vérifier si l'email existe déjà
      const existingUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existingUser) {
        toast({
          title: "Échec de l'inscription",
          description: "Cet email est déjà utilisé.",
          variant: "destructive",
        })
        return false
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: `${DEMO_USERS.length + 1}`,
        name,
        email,
        password,
      }

      // Dans une vraie application, on ajouterait l'utilisateur à la base de données
      // Ici, on simule juste
      DEMO_USERS.push(newUser)

      // Créer un utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser

      // Stocker l'utilisateur et le token
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("token", "demo-token-" + Date.now()) // Simuler un token

      setUser(userWithoutPassword)

      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${name} !`,
      })

      return true
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("guestUser")
    setUser(null)
    router.push("/")
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    })
  }

  // Fonction de mise à jour du profil
  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Mettre à jour l'utilisateur dans la "base de données"
    const userIndex = DEMO_USERS.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      DEMO_USERS[userIndex] = { ...DEMO_USERS[userIndex], ...userData }
    }

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    })
  }

  // Fonction pour continuer en tant qu'invité
  const continueAsGuest = () => {
    // Créer un utilisateur invité temporaire
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: "Invité",
      email: "guest@example.com",
      isGuest: true,
    }

    // Stocker l'utilisateur invité dans le localStorage
    localStorage.setItem("guestUser", JSON.stringify(guestUser))

    // Ne pas définir de token pour les invités

    // Mettre à jour l'état
    setUser(guestUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
