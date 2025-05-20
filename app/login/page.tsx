"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/compte"

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push(redirect)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestAccess = () => {
    toast({
      title: "Mode invité activé",
      description: "Vous naviguez en tant qu'invité. Certaines fonctionnalités peuvent être limitées.",
    })

    // Rediriger vers la page d'origine ou la page d'accueil
    if (redirect && redirect !== "/compte") {
      router.push(redirect)
    } else {
      router.push("/")
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
          <h1 className="text-xl font-semibold">Connexion</h1>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container grid gap-6 px-4 md:px-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-center space-y-4 md:col-span-1 lg:col-span-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Bienvenue sur Glowissime</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connectez-vous pour accéder à votre compte et découvrir nos produits exclusifs.
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
                <CardTitle>Connexion</CardTitle>
                <CardDescription>Entrez vos identifiants pour vous connecter</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link href="/forgot-password" className="text-sm text-pink-600 hover:underline">
                        Mot de passe oublié?
                      </Link>
                    </div>
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
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
                    {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                    onClick={handleGuestAccess}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Continuer en tant qu'invité
                  </Button>

                  <Button className="w-full bg-pink-600 hover:bg-pink-700" asChild>
                    <Link href="/register">Créer un compte</Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  En vous connectant, vous acceptez nos conditions générales d'utilisation.
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
