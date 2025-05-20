"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/context/store-context"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const { favorites, cartCount } = useStore()
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link href="#nouveautes" className="text-base font-medium hover:text-pink-600 transition-colors">
                    Nouveautés
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#visage" className="text-base font-medium hover:text-pink-600 transition-colors">
                    Visage
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#maquillage" className="text-base font-medium hover:text-pink-600 transition-colors">
                    Maquillage
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#soins" className="text-base font-medium hover:text-pink-600 transition-colors">
                    Soins
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#parfums" className="text-base font-medium hover:text-pink-600 transition-colors">
                    Parfums
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Glowissime Cosmetics" width={140} height={40} className="h-10 w-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#nouveautes" className="text-sm font-medium hover:underline underline-offset-4">
            Nouveautés
          </Link>
          <Link href="#visage" className="text-sm font-medium hover:underline underline-offset-4">
            Visage
          </Link>
          <Link href="#maquillage" className="text-sm font-medium hover:underline underline-offset-4">
            Maquillage
          </Link>
          <Link href="#soins" className="text-sm font-medium hover:underline underline-offset-4">
            Soins
          </Link>
          <Link href="#parfums" className="text-sm font-medium hover:underline underline-offset-4">
            Parfums
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher..." className="w-[200px] pl-8 rounded-full bg-muted/50" />
          </form>

          {/* Bouton Favoris */}
          <Link href="/favoris">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-pink-200 hover:bg-pink-50 hover:text-pink-600 relative"
                  >
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600">
                        {favorites.length}
                      </Badge>
                    )}
                    <span className="sr-only">Favoris</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mes favoris</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          {/* Bouton Compte */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={isAuthenticated ? "/compte" : "/login"}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-pink-200 hover:bg-pink-50 hover:text-pink-600 relative"
                  >
                    <User className="h-5 w-5" />
                    {isAuthenticated && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600">
                        1
                      </Badge>
                    )}
                    <span className="sr-only">Compte</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAuthenticated ? "Mon compte" : "Connexion / Inscription"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Bouton Panier */}
          <Link href="/panier">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-pink-200 hover:bg-pink-50 hover:text-pink-600 relative"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600">
                        {cartCount}
                      </Badge>
                    )}
                    <span className="sr-only">Panier</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mon panier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          {/* Bouton Connexion/Inscription (visible uniquement si non connecté) */}
          {!isAuthenticated && (
            <Button className="bg-pink-600 hover:bg-pink-700 hidden md:flex" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
