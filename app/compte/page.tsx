"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  Package,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  CreditCard,
  MapPin,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/auth-context"
import { useStore } from "@/context/store-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Header } from "@/components/header"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ComptePage() {
  const { user, logout, updateUserProfile } = useAuth()
  const { orders, favorites, cartItems } = useStore()
  const [activeTab, setActiveTab] = useState("profil")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    offers: true,
    newsletter: true,
  })

  // Données de paiement simulées
  const paymentMethods = [
    {
      id: "card1",
      type: "Visa",
      last4: "4242",
      expiry: "04/25",
      default: true,
    },
    {
      id: "card2",
      type: "Mastercard",
      last4: "8888",
      expiry: "09/26",
      default: false,
    },
  ]

  // Adresses simulées
  const addresses = [
    {
      id: "addr1",
      type: "Domicile",
      address: "123 Avenue des Champs-Élysées",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      default: true,
    },
    {
      id: "addr2",
      type: "Bureau",
      address: "45 Rue du Commerce",
      city: "Lyon",
      postalCode: "69002",
      country: "France",
      default: false,
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = () => {
    updateUserProfile(formData)
    toast({
      title: "Profil mis à jour",
      description: "Vos informations personnelles ont été mises à jour avec succès.",
    })
  }

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }
    setPasswordError("")
    // Dans une vraie application, on enverrait une requête au serveur pour mettre à jour le mot de passe
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
    })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences de notification ont été mises à jour.",
    })
  }

  const handleSetDefaultPayment = (id: string) => {
    // Simuler la mise à jour
    toast({
      title: "Méthode de paiement par défaut",
      description: "Votre méthode de paiement par défaut a été mise à jour.",
    })
  }

  const handleSetDefaultAddress = (id: string) => {
    // Simuler la mise à jour
    toast({
      title: "Adresse par défaut",
      description: "Votre adresse par défaut a été mise à jour.",
    })
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
              <span>Mon Compte</span>
            </div>

            <Tabs defaultValue="profil" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 space-y-6">
                  <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-600 font-medium text-xl">{user?.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    <TabsList className="grid grid-cols-2 mb-4 md:hidden">
                      <TabsTrigger value="profil">Profil</TabsTrigger>
                      <TabsTrigger value="commandes">Commandes</TabsTrigger>
                    </TabsList>

                    <div className="hidden md:block">
                      <Separator className="my-4" />
                      <nav className="flex flex-col space-y-1">
                        <TabsTrigger
                          value="profil"
                          className={`justify-start px-3 ${activeTab === "profil" ? "bg-pink-600 text-white hover:bg-pink-700" : ""}`}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profil
                        </TabsTrigger>
                        <TabsTrigger
                          value="commandes"
                          className={`justify-start px-3 ${activeTab === "commandes" ? "bg-pink-600 text-white hover:bg-pink-700" : ""}`}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Commandes
                        </TabsTrigger>
                        <TabsTrigger
                          value="paiement"
                          className={`justify-start px-3 ${activeTab === "paiement" ? "bg-pink-600 text-white hover:bg-pink-700" : ""}`}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Paiement
                        </TabsTrigger>
                        <TabsTrigger
                          value="adresses"
                          className={`justify-start px-3 ${activeTab === "adresses" ? "bg-pink-600 text-white hover:bg-pink-700" : ""}`}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Adresses
                        </TabsTrigger>
                        <TabsTrigger
                          value="notifications"
                          className={`justify-start px-3 ${activeTab === "notifications" ? "bg-pink-600 text-white hover:bg-pink-700" : ""}`}
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </TabsTrigger>
                        <Separator className="my-2" />
                        <Button variant="ghost" asChild>
                          <Link href="/favoris" className="justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Favoris
                            {favorites.length > 0 && <Badge className="ml-auto bg-pink-600">{favorites.length}</Badge>}
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                          <Link href="/panier" className="justify-start">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Panier
                            {cartItems.length > 0 && <Badge className="ml-auto bg-pink-600">{cartItems.length}</Badge>}
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start">
                          <Settings className="mr-2 h-4 w-4" />
                          Paramètres
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={logout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Déconnexion
                        </Button>
                      </nav>
                    </div>
                  </div>

                  <div className="bg-pink-50 rounded-lg border border-pink-100 p-4 hidden md:block">
                    <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Notre service client est disponible 7j/7 pour répondre à vos questions.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contactez-nous
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <TabsContent value="profil" className="mt-0">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Informations personnelles</CardTitle>
                          <CardDescription>Gérez vos informations personnelles et vos coordonnées</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nom complet</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleUpdateProfile}>
                            Enregistrer les modifications
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Adresse de livraison</CardTitle>
                          <CardDescription>Gérez votre adresse de livraison par défaut</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Label htmlFor="address">Adresse complète</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleUpdateProfile}>
                            Enregistrer l'adresse
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Mot de passe</CardTitle>
                          <CardDescription>Modifiez votre mot de passe</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Mot de passe actuel</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
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
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                            <div className="relative">
                              <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleUpdatePassword}>
                            Changer le mot de passe
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="commandes" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Mes commandes</CardTitle>
                        <CardDescription>Historique de vos commandes récentes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {orders.length === 0 ? (
                          <div className="text-center py-6">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground/30" />
                            <h3 className="mt-4 text-lg font-medium">Aucune commande</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Vous n'avez pas encore passé de commande
                            </p>
                            <Button className="mt-4 bg-pink-600 hover:bg-pink-700" asChild>
                              <Link href="/">Commencer à magasiner</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">Commande #{order.id}</h3>
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                          order.status === "Livré"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "En cours"
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-amber-100 text-amber-700"
                                        }`}
                                      >
                                        {order.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Date: {order.date} • {order.items} article(s)
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="font-semibold">{order.total.toFixed(2)} €</span>
                                    <Button variant="outline" size="sm">
                                      Détails
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <Separator className="my-3" />

                                <div className="flex flex-wrap gap-2">
                                  {order.products.slice(0, 3).map((product) => (
                                    <div key={product.id} className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded overflow-hidden">
                                        <Image
                                          src={product.image || "/placeholder.svg"}
                                          alt={product.name}
                                          width={40}
                                          height={40}
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {product.quantity} x {product.price.toFixed(2)} €
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {order.products.length > 3 && (
                                    <div className="flex items-center">
                                      <span className="text-sm text-muted-foreground">
                                        +{order.products.length - 3} autres produits
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="paiement" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Méthodes de paiement</CardTitle>
                        <CardDescription>Gérez vos méthodes de paiement</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between border rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                  {method.type === "Visa" ? (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                      <path d="M22 9H2V15H22V9Z" fill="#1A1F71" />
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                      <circle cx="9" cy="12" r="6" fill="#EB001B" />
                                      <circle cx="15" cy="12" r="6" fill="#F79E1B" />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 16.2C13.3 15.1 14.1 13.6 14.1 12C14.1 10.4 13.3 8.9 12 7.8C10.7 8.9 9.9 10.4 9.9 12C9.9 13.6 10.7 15.1 12 16.2Z"
                                        fill="#FF5F00"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {method.type} •••• {method.last4}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Expire le {method.expiry}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {method.default ? (
                                  <Badge className="bg-green-600">Par défaut</Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultPayment(method.id)}
                                  >
                                    Définir par défaut
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="mt-4 bg-pink-600 hover:bg-pink-700">Ajouter une méthode de paiement</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="adresses" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Mes adresses</CardTitle>
                        <CardDescription>Gérez vos adresses de livraison et de facturation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {addresses.map((address) => (
                            <div key={address.id} className="flex items-center justify-between border rounded-lg p-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{address.type}</p>
                                  {address.default && <Badge className="bg-green-600">Par défaut</Badge>}
                                </div>
                                <p className="text-sm">{address.address}</p>
                                <p className="text-sm">
                                  {address.postalCode} {address.city}, {address.country}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!address.default && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                  >
                                    Définir par défaut
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="mt-4 bg-pink-600 hover:bg-pink-700">Ajouter une adresse</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Préférences de notification</CardTitle>
                        <CardDescription>Gérez comment vous souhaitez être notifié</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notifications par email</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez des mises à jour sur vos commandes par email
                              </p>
                            </div>
                            <Switch
                              checked={notifications.email}
                              onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notifications par SMS</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez des mises à jour sur vos commandes par SMS
                              </p>
                            </div>
                            <Switch
                              checked={notifications.sms}
                              onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Offres et promotions</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez des offres exclusives et des promotions
                              </p>
                            </div>
                            <Switch
                              checked={notifications.offers}
                              onCheckedChange={(checked) => handleNotificationChange("offers", checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Newsletter</p>
                              <p className="text-sm text-muted-foreground">Recevez notre newsletter mensuelle</p>
                            </div>
                            <Switch
                              checked={notifications.newsletter}
                              onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="bg-pink-600 hover:bg-pink-700">Enregistrer les préférences</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
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
