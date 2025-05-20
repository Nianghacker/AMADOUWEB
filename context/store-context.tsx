"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Types pour les produits et l'utilisateur
export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  tag?: string
}

export type CartItem = Product & {
  quantity: number
}

export type User = {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export type Order = {
  id: string
  date: string
  status: string
  total: number
  items: number
  products: CartItem[]
}

// Type pour le contexte
type StoreContextType = {
  // Panier
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Favoris
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean

  // Utilisateur
  user: User | null
  setUser: (user: User | null) => void

  // Commandes
  orders: Order[]
  addOrder: (order: Order) => void

  // Totaux du panier
  cartTotal: number
  cartCount: number
}

// Valeurs par défaut du contexte
const defaultContext: StoreContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},

  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,

  user: null,
  setUser: () => {},

  orders: [],
  addOrder: () => {},

  cartTotal: 0,
  cartCount: 0,
}

// Création du contexte
const StoreContext = createContext<StoreContextType>(defaultContext)

// Hook personnalisé pour utiliser le contexte
export const useStore = () => useContext(StoreContext)

// Provider du contexte
export function StoreProvider({ children }: { children: ReactNode }) {
  // État pour le panier
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // État pour les favoris
  const [favorites, setFavorites] = useState<Product[]>([])

  // État pour l'utilisateur
  const [user, setUser] = useState<User | null>(null)

  // État pour les commandes
  const [orders, setOrders] = useState<Order[]>([])

  // Charger les données depuis localStorage au chargement de la page
  useEffect(() => {
    const loadStoredData = () => {
      try {
        // Charger le panier
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
          setCartItems(JSON.parse(storedCart))
        }

        // Charger les favoris
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }

        // Charger l'utilisateur
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Charger les commandes
        const storedOrders = localStorage.getItem("orders")
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders))
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadStoredData()
  }, [])

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  // Fonctions pour gérer le panier
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Sinon, ajouter le nouveau produit
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Fonctions pour gérer les favoris
  const addToFavorites = (product: Product) => {
    if (!favorites.some((item) => item.id === product.id)) {
      setFavorites((prev) => [...prev, product])
    }
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId)
  }

  // Fonction pour ajouter une commande
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  // Calculer les totaux du panier
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // Valeur du contexte
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,

    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    user,
    setUser,

    orders,
    addOrder,

    cartTotal,
    cartCount,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
