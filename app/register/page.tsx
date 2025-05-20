"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/compte")
    }
  }, [isAuthenticated, router])

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return false
    }
    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword()) {
      return
    }

    setIsSubmitting(true)

    try {
      const success = await register(name, email, password)
      if (success) {
        router.push("/compte")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-xl font-semibold">Inscription</h1>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container grid gap-6 px-4 md:px-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-center space-y-4 md:col-span-1 lg:col-span-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Rejoignez Glowissime</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Créez votre compte pour profiter de nos offres exclusives et suivre vos commandes.
              </p>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&h=600&auto=format&fit=crop"
                alt="Produits cosmétiques"
                width={600}
                height={600}
                className="mx-auto aspect-square rounded-xl object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>Créez votre compte en quelques étapes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Masquer" : "Afficher"} le mot de passe</span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
                    {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Déjà un compte?{" "}
                  <Link href="/login" className="text-pink-600 hover:underline">
                    Se connecter
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  En vous inscrivant, vous acceptez nos conditions générales d'utilisation et notre politique de
                  confidentialité.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 Glowissime Cosmetics. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
