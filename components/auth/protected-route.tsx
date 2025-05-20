"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, LogIn } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [showGuestBanner, setShowGuestBanner] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Vérifier si l'utilisateur est un invité
      const guestUser = localStorage.getItem("guestUser")

      if (guestUser) {
        // Si c'est un invité, afficher la bannière mais permettre l'accès
        setShowGuestBanner(true)
      } else {
        // Sinon, rediriger vers la page de connexion
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est authentifié ou est un invité avec la bannière
  return (
    <>
      {showGuestBanner && (
        <div className="bg-pink-50 border-b border-pink-100 py-2">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-pink-600 mr-2" />
                <p className="text-sm">
                  Vous naviguez en tant qu'invité. Certaines fonctionnalités peuvent être limitées.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="h-8">
                  <Link href="/register">Créer un compte</Link>
                </Button>
                <Button size="sm" className="h-8 bg-pink-600 hover:bg-pink-700" asChild>
                  <Link href="/login">
                    <LogIn className="h-3 w-3 mr-1" />
                    Se connecter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
