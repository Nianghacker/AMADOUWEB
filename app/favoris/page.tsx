"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/context/store-context"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Header } from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function FavorisPage() {
  const { favorites, removeFromFavorites, addToCart, isFavorite, addToFavorites } = useStore()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(favorites.length / itemsPerPage)

  // Obtenir les éléments pour la page actuelle
  const currentItems = favorites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Simuler un temps de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Fonction pour supprimer un produit des favoris
  const handleRemoveFromFavorites = (productId: string, productName: string) => {
    removeFromFavorites(productId)
    toast({
      title: "Produit retiré des favoris",
      description: `${productName} a été retiré de vos favoris.`,
    })
  }

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
      action: (
        <Link href="/panier" className="text-pink-600 hover:underline">
          Voir le panier
        </Link>
      ),
    })
  }

  // Fonction pour changer de page
  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Accueil
              </Link>
              <span className="text-muted-foreground">/</span>
              <span>Mes Favoris</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar avec informations utilisateur */}
              <div className="w-full md:w-64 space-y-6">
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-medium text-lg">{user?.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Link href="/compte" className="text-sm text-muted-foreground hover:text-foreground block">
                      Mon compte
                    </Link>
                    <Link href="/panier" className="text-sm text-muted-foreground hover:text-foreground block">
                      Mon panier
                    </Link>
                    <Link href="/favoris" className="text-sm text-pink-600 font-medium block">
                      Mes favoris ({favorites.length})
                    </Link>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg border border-pink-100 p-4">
                  <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Notre service client est disponible 7j/7 pour répondre à vos questions.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contactez-nous
                  </Button>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Chargement de vos favoris...</p>
                    </div>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <h2 className="mt-4 text-xl font-semibold">Vous n'avez pas encore de favoris</h2>
                    <p className="mt-2 text-muted-foreground">
                      Explorez notre catalogue et ajoutez des produits à vos favoris
                    </p>
                    <Button className="mt-6 bg-pink-600 hover:bg-pink-700" asChild>
                      <Link href="/">Découvrir nos produits</Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Mes Favoris ({favorites.length})</h2>
                      <Button variant="outline" asChild>
                        <Link href="/">Continuer mes achats</Link>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {currentItems.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-white"
                        >
                          <div className="w-full sm:w-32 h-32 rounded-md overflow-hidden relative group">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={128}
                              height={128}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            {product.tag && <Badge className="absolute top-2 left-2 bg-pink-600">{product.tag}</Badge>}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="font-medium text-lg">{product.name}</h3>
                                <p className="text-muted-foreground text-sm">Catégorie: {product.category}</p>
                                <div className="mt-2 flex items-center">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className="w-4 h-4 text-yellow-300 mr-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                      >
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                                </div>
                              </div>
                              <div className="text-lg font-semibold">{product.price.toFixed(2)} €</div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button
                                className="bg-pink-600 hover:bg-pink-700"
                                onClick={() => handleAddToCart(product)}
                              >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Ajouter au panier
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleRemoveFromFavorites(product.id, product.name)}
                                className="border-pink-200 text-pink-600 hover:bg-pink-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Retirer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              className={currentPage === page ? "bg-pink-600 hover:bg-pink-700" : ""}
                              onClick={() => changePage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Recommandations */}
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold mb-4">Vous pourriez aussi aimer</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            id: "rec1",
                            name: "Sérum Vitamine C",
                            price: 34.9,
                            image:
                              "https://images.unsplash.com/photo-1611930022073-84f39e064681?q=80&w=300&h=300&auto=format&fit=crop",
                            category: "visage",
                          },
                          {
                            id: "rec2",
                            name: "Huile Visage",
                            price: 29.9,
                            image:
                              "https://images.unsplash.com/photo-1570194065650-d99fb4abbd47?q=80&w=300&h=300&auto=format&fit=crop",
                            category: "visage",
                          },
                          {
                            id: "rec3",
                            name: "Crème Nuit",
                            price: 39.9,
                            image:
                              "https://images.unsplash.com/photo-1567721913486-6585f069b332?q=80&w=300&h=300&auto=format&fit=crop",
                            category: "visage",
                          },
                          {
                            id: "rec4",
                            name: "Masque Hydratant",
                            price: 24.9,
                            image:
                              "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=300&h=300&auto=format&fit=crop",
                            category: "visage",
                          },
                        ].map((product) => (
                          <div
                            key={product.id}
                            className="group relative overflow-hidden rounded-lg bg-white border p-2"
                          >
                            <div className="absolute right-2 top-2 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full bg-white/80 ${
                                  isFavorite(product.id) ? "text-pink-600" : "text-gray-400"
                                } hover:bg-pink-100 hover:text-pink-700`}
                                onClick={() =>
                                  isFavorite(product.id)
                                    ? handleRemoveFromFavorites(product.id, product.name)
                                    : addToFavorites(product)
                                }
                              >
                                <Heart className="h-4 w-4" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                              </Button>
                            </div>
                            <Link href="#" className="block overflow-hidden rounded-md">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={150}
                                height={150}
                                className="aspect-square object-cover transition-transform group-hover:scale-105"
                              />
                            </Link>
                            <div className="pt-3">
                              <h3 className="font-medium text-sm">{product.name}</h3>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-sm">{product.price.toFixed(2)} €</span>
                                <Button
                                  size="sm"
                                  className="bg-pink-600 hover:bg-pink-700 transition-colors h-8 text-xs px-2"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <ShoppingBag className="h-3 w-3 mr-1" />
                                  Ajouter
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
    </ProtectedRoute>
  )
}
