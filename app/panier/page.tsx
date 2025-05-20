"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2, CreditCard, Truck, Gift, ChevronRight, Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/context/store-context"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function PanierPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal, clearCart, addOrder } = useStore()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState("panier") // panier, livraison, paiement, confirmation
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNote, setOrderNote] = useState("")
  const [savePaymentInfo, setSavePaymentInfo] = useState(false)
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })
  const [deliveryCountry, setDeliveryCountry] = useState("senegal")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryPhone, setDeliveryPhone] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [notificationEmail, setNotificationEmail] = useState("")
  const [notificationSMS, setNotificationSMS] = useState(false)

  // Simuler un temps de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Fonction pour appliquer un code promo
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "promo20") {
      setPromoApplied(true)
      toast({
        title: "Code promo appliqué",
        description: "Votre code promo a été appliqué avec succès.",
      })
    } else {
      toast({
        title: "Code promo invalide",
        description: "Le code promo saisi n'est pas valide.",
        variant: "destructive",
      })
    }
  }

  // Calculer les frais de livraison en fonction du pays
  const getShippingCost = () => {
    if (subtotal > 50) {
      if (deliveryCountry === "senegal") {
        return shippingMethod === "express" ? 3000 : 0 // Gratuit pour standard au Sénégal au-dessus de 50€
      } else if (deliveryCountry === "mali") {
        return shippingMethod === "express" ? 7500 : 5000
      } else if (deliveryCountry === "guinee") {
        return shippingMethod === "express" ? 8000 : 5500
      }
    } else {
      if (deliveryCountry === "senegal") {
        return shippingMethod === "express" ? 3000 : 1500
      } else if (deliveryCountry === "mali") {
        return shippingMethod === "express" ? 7500 : 5000
      } else if (deliveryCountry === "guinee") {
        return shippingMethod === "express" ? 8000 : 5500
      }
    }
    return 0
  }

  // Calculer les totaux
  const subtotal = cartTotal
  const discount = promoApplied ? subtotal * 0.2 : 0 // 20% de réduction
  const shipping = getShippingCost()
  const tax = (subtotal - discount) * 0.18 // TVA 18% (taux au Sénégal)
  const total = subtotal - discount + shipping

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    if (checkoutStep === "panier") {
      setCheckoutStep("livraison")
    } else if (checkoutStep === "livraison") {
      setCheckoutStep("paiement")
    } else if (checkoutStep === "paiement") {
      handlePlaceOrder()
    }
  }

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    if (checkoutStep === "livraison") {
      setCheckoutStep("panier")
    } else if (checkoutStep === "paiement") {
      setCheckoutStep("livraison")
    } else if (checkoutStep === "confirmation") {
      setCheckoutStep("panier")
    }
  }

  // Fonction pour envoyer une demande de livraison spéciale
  const sendDeliveryRequest = () => {
    if (!deliveryAddress || !deliveryPhone) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir l'adresse et le numéro de téléphone pour la livraison.",
        variant: "destructive",
      })
      return
    }

    // Simuler l'envoi d'une demande
    toast({
      title: "Demande envoyée",
      description: "Votre demande de livraison spéciale a été envoyée. Vous serez contacté prochainement.",
    })

    // Dans un cas réel, vous enverriez ces données à votre backend
    console.log("Demande de livraison spéciale:", {
      address: deliveryAddress,
      phone: deliveryPhone,
      country: deliveryCountry,
      instructions: deliveryInstructions,
      notifyEmail: notificationEmail,
      notifySMS: notificationSMS,
    })
  }

  // Fonction pour passer la commande
  const handlePlaceOrder = () => {
    setIsProcessing(true)

    // Simuler un délai de traitement
    setTimeout(() => {
      // Créer un nouvel ID de commande
      const orderId = `ORD-${Date.now().toString().slice(-6)}`

      // Créer une nouvelle commande
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: "En cours",
        total: total,
        items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        products: [...cartItems],
        shippingAddress: deliveryAddress || "Adresse par défaut",
        shippingCountry: deliveryCountry,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        customerPhone: deliveryPhone,
        customerEmail: notificationEmail || user?.email || "",
        notifySMS: notificationSMS,
      }

      // Ajouter la commande à l'historique
      addOrder(newOrder)

      // Vider le panier
      clearCart()

      // Afficher un message de confirmation
      toast({
        title: "Commande passée avec succès",
        description: `Votre commande #${orderId} a été passée avec succès.`,
      })

      // Dans un cas réel, vous enverriez ces données à votre backend
      console.log("Nouvelle commande:", newOrder)

      // Passer à l'étape de confirmation
      setCheckoutStep("confirmation")
      setIsProcessing(false)
    }, 2000)
  }

  // Fonction pour formater le numéro de carte
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Fonction pour formater la date d'expiration
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
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
              <span>Mon Panier</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Chargement de votre panier...</p>
                </div>
              </div>
            ) : cartItems.length === 0 && checkoutStep !== "confirmation" ? (
              <div className="text-center py-16 bg-white rounded-lg border">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <h2 className="mt-4 text-xl font-semibold">Votre panier est vide</h2>
                <p className="mt-2 text-muted-foreground">
                  Ajoutez des produits à votre panier pour commencer vos achats
                </p>
                <Button className="mt-6 bg-pink-600 hover:bg-pink-700" asChild>
                  <Link href="/">Découvrir nos produits</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Étapes du processus de paiement */}
                {checkoutStep !== "confirmation" && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            checkoutStep === "panier" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-sm mt-1">Panier</span>
                      </div>
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          checkoutStep === "livraison" || checkoutStep === "paiement" ? "bg-pink-600" : "bg-gray-200"
                        }`}
                      />
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            checkoutStep === "livraison"
                              ? "bg-pink-600 text-white"
                              : checkoutStep === "paiement"
                                ? "bg-pink-600 text-white"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Truck className="h-5 w-5" />
                        </div>
                        <span className="text-sm mt-1">Livraison</span>
                      </div>
                      <div
                        className={`flex-1 h-1 mx-2 ${checkoutStep === "paiement" ? "bg-pink-600" : "bg-gray-200"}`}
                      />
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            checkoutStep === "paiement" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <span className="text-sm mt-1">Paiement</span>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === "panier" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Votre Panier</h2>
                        <Button variant="outline" asChild>
                          <Link href="/">Continuer mes achats</Link>
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 bg-white">
                            <div className="w-full sm:w-32 h-32 rounded-md overflow-hidden relative group">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                              {item.tag && <Badge className="absolute top-2 left-2 bg-pink-600">{item.tag}</Badge>}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div>
                                  <h3 className="font-medium text-lg">{item.name}</h3>
                                  <p className="text-muted-foreground text-sm">Catégorie: {item.category}</p>
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
                                <div className="text-lg font-semibold">{item.price.toFixed(2)} €</div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <Label htmlFor="order-note">Note pour la commande</Label>
                            <Textarea
                              id="order-note"
                              placeholder="Instructions spéciales pour la livraison, etc."
                              className="mt-2"
                              value={orderNote}
                              onChange={(e) => setOrderNote(e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="promo-code">Code promo</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="promo-code"
                                placeholder="Entrez votre code promo"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={promoApplied}
                              />
                              <Button
                                variant="outline"
                                onClick={applyPromoCode}
                                disabled={promoApplied || !promoCode}
                                className="whitespace-nowrap"
                              >
                                Appliquer
                              </Button>
                            </div>
                            {promoApplied && (
                              <p className="text-sm text-green-600 mt-1 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Code promo appliqué avec succès
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="border rounded-lg p-6 bg-white sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{subtotal.toFixed(2)} €</span>
                          </div>
                          {promoApplied && (
                            <div className="flex justify-between text-green-600">
                              <span>Réduction (20%)</span>
                              <span>-{discount.toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Livraison</span>
                            <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(0)} FCFA`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA (18%)</span>
                            <span>{tax.toFixed(2)} €</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{total.toFixed(2)} €</span>
                          </div>
                          <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700" onClick={goToNextStep}>
                            Passer à la livraison
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                          <p className="text-xs text-center text-muted-foreground mt-4">
                            En passant votre commande, vous acceptez nos conditions générales de vente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === "livraison" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Livraison</h2>
                        <Button variant="outline" onClick={goToPreviousStep}>
                          Retour au panier
                        </Button>
                      </div>

                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Pays de livraison</CardTitle>
                          <CardDescription>Sélectionnez le pays où vous souhaitez être livré</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            defaultValue="senegal"
                            value={deliveryCountry}
                            onValueChange={setDeliveryCountry}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="senegal" id="senegal" />
                              <Label htmlFor="senegal" className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Sénégal</p>
                                    <p className="text-sm text-muted-foreground">
                                      Livraison disponible dans tout le pays
                                    </p>
                                  </div>
                                  <Badge>Recommandé</Badge>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="mali" id="mali" />
                              <Label htmlFor="mali" className="flex-1 cursor-pointer">
                                <div>
                                  <p className="font-medium">Mali</p>
                                  <p className="text-sm text-muted-foreground">
                                    Livraison disponible dans les grandes villes
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="guinee" id="guinee" />
                              <Label htmlFor="guinee" className="flex-1 cursor-pointer">
                                <div>
                                  <p className="font-medium">Guinée</p>
                                  <p className="text-sm text-muted-foreground">
                                    Livraison disponible dans les grandes villes
                                  </p>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </CardContent>
                      </Card>

                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Adresse de livraison</CardTitle>
                          <CardDescription>Entrez votre adresse de livraison complète</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="delivery-address">Adresse complète</Label>
                              <Textarea
                                id="delivery-address"
                                placeholder="Quartier, rue, numéro, points de repère..."
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="delivery-phone">Numéro de téléphone</Label>
                              <Input
                                id="delivery-phone"
                                placeholder="Ex: 77 123 45 67"
                                value={deliveryPhone}
                                onChange={(e) => setDeliveryPhone(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Ce numéro sera utilisé pour vous contacter concernant votre livraison
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Méthode de livraison</CardTitle>
                          <CardDescription>Choisissez comment vous souhaitez recevoir votre commande</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            defaultValue="standard"
                            value={shippingMethod}
                            onValueChange={setShippingMethod}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="standard" id="standard" />
                              <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Livraison standard</p>
                                    <p className="text-sm text-muted-foreground">
                                      {deliveryCountry === "senegal"
                                        ? "Livraison en 2-3 jours ouvrés"
                                        : "Livraison en 5-7 jours ouvrés"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {deliveryCountry === "senegal" && subtotal > 50
                                        ? "Gratuit"
                                        : `${deliveryCountry === "senegal" ? "1 500" : deliveryCountry === "mali" ? "5 000" : "5 500"} FCFA`}
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="express" id="express" />
                              <Label htmlFor="express" className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Livraison express</p>
                                    <p className="text-sm text-muted-foreground">
                                      {deliveryCountry === "senegal"
                                        ? "Livraison en 24h"
                                        : "Livraison en 2-3 jours ouvrés"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {deliveryCountry === "senegal"
                                        ? "3 000"
                                        : deliveryCountry === "mali"
                                          ? "7 500"
                                          : "8 000"}{" "}
                                      FCFA
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </CardContent>
                      </Card>

                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle>Demande de livraison spéciale</CardTitle>
                          <CardDescription>
                            Besoin d'une livraison personnalisée ? Envoyez une demande au gestionnaire du site.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="delivery-instructions">Instructions spéciales</Label>
                              <Textarea
                                id="delivery-instructions"
                                placeholder="Précisez vos besoins spécifiques pour la livraison"
                                rows={3}
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notification-email">Email pour les notifications</Label>
                              <Input
                                id="notification-email"
                                type="email"
                                placeholder="Votre email pour recevoir les mises à jour"
                                value={notificationEmail}
                                onChange={(e) => setNotificationEmail(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="notification-sms"
                                checked={notificationSMS}
                                onCheckedChange={(checked) => setNotificationSMS(checked as boolean)}
                              />
                              <Label htmlFor="notification-sms" className="cursor-pointer">
                                Recevoir des notifications par SMS
                              </Label>
                            </div>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={sendDeliveryRequest}>
                              Envoyer ma demande de livraison
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="gift" />
                          <Label htmlFor="gift" className="flex items-center cursor-pointer">
                            <Gift className="h-4 w-4 mr-2 text-pink-600" />
                            Ajouter un emballage cadeau (+1 000 FCFA)
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="border rounded-lg p-6 bg-white sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{subtotal.toFixed(2)} €</span>
                          </div>
                          {promoApplied && (
                            <div className="flex justify-between text-green-600">
                              <span>Réduction (20%)</span>
                              <span>-{discount.toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Livraison</span>
                            <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(0)} FCFA`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA (18%)</span>
                            <span>{tax.toFixed(2)} €</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{total.toFixed(2)} €</span>
                          </div>
                          <Button
                            className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                            onClick={goToNextStep}
                            disabled={!deliveryAddress || !deliveryPhone}
                          >
                            Passer au paiement
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                          {(!deliveryAddress || !deliveryPhone) && (
                            <p className="text-xs text-red-500 text-center mt-2">
                              Veuillez remplir l'adresse et le numéro de téléphone pour continuer
                            </p>
                          )}
                          <p className="text-xs text-center text-muted-foreground mt-4">
                            En passant votre commande, vous acceptez nos conditions générales de vente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === "paiement" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Paiement</h2>
                        <Button variant="outline" onClick={goToPreviousStep}>
                          Retour à la livraison
                        </Button>
                      </div>

                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Méthode de paiement</CardTitle>
                          <CardDescription>Choisissez comment vous souhaitez payer</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="wave" onValueChange={setPaymentMethod} value={paymentMethod}>
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="wave">Wave</TabsTrigger>
                              <TabsTrigger value="orange">Orange Money</TabsTrigger>
                              <TabsTrigger value="card">Carte bancaire</TabsTrigger>
                              <TabsTrigger value="cash">Paiement à la livraison</TabsTrigger>
                            </TabsList>
                            <TabsContent value="wave" className="mt-4">
                              <div className="text-center py-8 border rounded-lg">
                                <div className="w-16 h-16 bg-[#1DCBEF] rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-white font-bold text-xl">Wave</span>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                  Payez facilement avec votre compte Wave Mobile Money.
                                </p>
                                <div className="max-w-xs mx-auto space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="wave-number">Numéro Wave</Label>
                                    <Input
                                      id="wave-number"
                                      placeholder="Entrez votre numéro Wave"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <p className="font-medium">Instructions de paiement:</p>
                                    <ol className="text-sm text-left list-decimal pl-5 mt-2 space-y-1">
                                      <li>
                                        Envoyez le montant de{" "}
                                        <span className="font-semibold">{total.toFixed(0)} FCFA</span> au numéro{" "}
                                        <span className="font-semibold">77 123 45 67</span>
                                      </li>
                                      <li>
                                        Utilisez la référence:{" "}
                                        <span className="font-semibold">CMD-{Date.now().toString().slice(-6)}</span>
                                      </li>
                                      <li>Entrez votre numéro Wave ci-dessus pour confirmer</li>
                                    </ol>
                                  </div>
                                  <Button className="w-full bg-[#1DCBEF] hover:bg-[#1ab8d9]">
                                    Confirmer le paiement Wave
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="orange" className="mt-4">
                              <div className="text-center py-8 border rounded-lg">
                                <div className="w-16 h-16 bg-[#FF6600] rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-white font-bold text-sm">Orange Money</span>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                  Payez facilement avec votre compte Orange Money.
                                </p>
                                <div className="max-w-xs mx-auto space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="orange-number">Numéro Orange Money</Label>
                                    <Input
                                      id="orange-number"
                                      placeholder="Entrez votre numéro Orange Money"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <p className="font-medium">Instructions de paiement:</p>
                                    <ol className="text-sm text-left list-decimal pl-5 mt-2 space-y-1">
                                      <li>
                                        Envoyez le montant de{" "}
                                        <span className="font-semibold">{total.toFixed(0)} FCFA</span> au numéro{" "}
                                        <span className="font-semibold">78 123 45 67</span>
                                      </li>
                                      <li>
                                        Utilisez la référence:{" "}
                                        <span className="font-semibold">CMD-{Date.now().toString().slice(-6)}</span>
                                      </li>
                                      <li>Entrez votre numéro Orange Money ci-dessus pour confirmer</li>
                                    </ol>
                                  </div>
                                  <Button className="w-full bg-[#FF6600] hover:bg-[#e65c00]">
                                    Confirmer le paiement Orange Money
                                  </Button>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="card" className="mt-4">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="card-number">Numéro de carte</Label>
                                  <Input
                                    id="card-number"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardInfo.number}
                                    onChange={(e) =>
                                      setCardInfo({ ...cardInfo, number: formatCardNumber(e.target.value) })
                                    }
                                    maxLength={19}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="card-name">Nom sur la carte</Label>
                                  <Input
                                    id="card-name"
                                    placeholder="John Doe"
                                    value={cardInfo.name}
                                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="expiry">Date d'expiration</Label>
                                    <Input
                                      id="expiry"
                                      placeholder="MM/YY"
                                      value={cardInfo.expiry}
                                      onChange={(e) =>
                                        setCardInfo({ ...cardInfo, expiry: formatExpiryDate(e.target.value) })
                                      }
                                      maxLength={5}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                      id="cvc"
                                      placeholder="123"
                                      value={cardInfo.cvc}
                                      onChange={(e) =>
                                        setCardInfo({ ...cardInfo, cvc: e.target.value.replace(/\D/g, "") })
                                      }
                                      maxLength={3}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="save-card"
                                    checked={savePaymentInfo}
                                    onCheckedChange={(checked) => setSavePaymentInfo(checked as boolean)}
                                  />
                                  <Label htmlFor="save-card">Enregistrer cette carte pour mes prochains achats</Label>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="cash" className="mt-4">
                              <div className="text-center py-8 border rounded-lg">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Paiement à la livraison</h3>
                                <p className="text-muted-foreground mb-4">
                                  Payez en espèces lors de la réception de votre commande.
                                </p>
                                <div className="p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
                                  <p className="font-medium mb-2">Informations importantes:</p>
                                  <ul className="text-sm space-y-1 list-disc pl-5">
                                    <li>
                                      Préparez le montant exact de{" "}
                                      <span className="font-semibold">{total.toFixed(0)} FCFA</span>
                                    </li>
                                    <li>Vérifiez votre commande avant de payer</li>
                                    <li>Un reçu vous sera remis après paiement</li>
                                    <li>Cette option n'est disponible que pour les livraisons au Sénégal</li>
                                  </ul>
                                </div>
                                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                                  Confirmer le paiement à la livraison
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Adresse de facturation</CardTitle>
                          <CardDescription>Sélectionnez votre adresse de facturation</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-2 mb-4">
                            <Checkbox id="same-address" defaultChecked />
                            <Label htmlFor="same-address">Utiliser la même adresse que pour la livraison</Label>
                          </div>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <p className="font-medium">Adresse de livraison</p>
                            <p className="text-sm text-muted-foreground">
                              {deliveryAddress || "Adresse non spécifiée"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {deliveryCountry === "senegal"
                                ? "Sénégal"
                                : deliveryCountry === "mali"
                                  ? "Mali"
                                  : "Guinée"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <div className="border rounded-lg p-6 bg-white sticky top-24">
                        <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{subtotal.toFixed(2)} €</span>
                          </div>
                          {promoApplied && (
                            <div className="flex justify-between text-green-600">
                              <span>Réduction (20%)</span>
                              <span>-{discount.toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Livraison</span>
                            <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(0)} FCFA`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TVA (18%)</span>
                            <span>{tax.toFixed(2)} €</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{total.toFixed(2)} €</span>
                          </div>
                          <Button
                            className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                            onClick={goToNextStep}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Traitement en cours...
                              </>
                            ) : (
                              <>
                                Passer la commande
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                          <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
                            <Info className="h-3 w-3 mr-1" />
                            Paiement sécurisé
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            En passant votre commande, vous acceptez nos conditions générales de vente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === "confirmation" && (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center py-8 bg-white rounded-lg border">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Commande confirmée !</h2>
                      <p className="text-muted-foreground mb-6">
                        Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
                      </p>

                      <Card className="mb-6 text-left">
                        <CardHeader>
                          <CardTitle>Détails de la commande</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Numéro de commande</span>
                              <span>ORD-{Date.now().toString().slice(-6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Date</span>
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Total</span>
                              <span>{total.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Méthode de paiement</span>
                              <span>
                                {paymentMethod === "card"
                                  ? "Carte bancaire"
                                  : paymentMethod === "wave"
                                    ? "Wave"
                                    : paymentMethod === "orange"
                                      ? "Orange Money"
                                      : "Paiement à la livraison"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Livraison estimée</span>
                              <span>
                                {shippingMethod === "express"
                                  ? deliveryCountry === "senegal"
                                    ? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                  : deliveryCountry === "senegal"
                                    ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                          <Link href="/compte?tab=commandes">Voir mes commandes</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/">Continuer mes achats</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <footer className="border-t py-6 mt-12">
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
