"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Box, ChevronDown, Clock, Home, Search, Settings, ShoppingBag, Truck, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/context/store-context"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types pour les notifications
type NotificationType = "order" | "delivery" | "message" | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
  data?: any
}

export default function AdminPage() {
  const { orders } = useStore()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [deliveryRequests, setDeliveryRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [orderFilter, setOrderFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simuler des notifications
      setNotifications([
        {
          id: "1",
          type: "order",
          title: "Nouvelle commande",
          message: "Commande #ORD-123456 reçue",
          date: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
          read: false,
          data: {
            orderId: "ORD-123456",
            total: 75.99,
            items: 3,
          },
        },
        {
          id: "2",
          type: "delivery",
          title: "Demande de livraison",
          message: "Nouvelle demande de livraison à Dakar",
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
          read: false,
          data: {
            address: "Sacré-Cœur 3, Dakar, Sénégal",
            phone: "77 123 45 67",
          },
        },
        {
          id: "3",
          type: "delivery",
          title: "Demande de livraison",
          message: "Nouvelle demande de livraison à Bamako",
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(),
          read: true,
          data: {
            address: "Hamdallaye ACI 2000, Bamako, Mali",
            phone: "76 987 65 43",
          },
        },
        {
          id: "4",
          type: "message",
          title: "Message client",
          message: "Question sur la disponibilité d'un produit",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(),
          read: true,
        },
      ])

      // Simuler des demandes de livraison
      setDeliveryRequests([
        {
          id: "DR-001",
          date: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
          customer: "Fatou Diop",
          phone: "77 123 45 67",
          address: "Sacré-Cœur 3, Dakar, Sénégal",
          country: "Sénégal",
          instructions: "Livraison après 18h s'il vous plaît",
          status: "pending",
        },
        {
          id: "DR-002",
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(),
          customer: "Amadou Traoré",
          phone: "76 987 65 43",
          address: "Hamdallaye ACI 2000, Bamako, Mali",
          country: "Mali",
          instructions: "Appeler avant la livraison",
          status: "processing",
        },
        {
          id: "DR-003",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
          customer: "Mariama Camara",
          phone: "62 456 78 90",
          address: "Kaloum, Conakry, Guinée",
          country: "Guinée",
          instructions: "Livraison urgente",
          status: "completed",
        },
      ])

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    if (orderFilter !== "all" && order.status.toLowerCase() !== orderFilter) {
      return false
    }

    if (searchQuery) {
      return (
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.products.some((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return true
  })

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Nombre de notifications non lues
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-lg font-semibold">Glowissime Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <div className="flex flex-col gap-2 p-4">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Commandes
            </Button>
            <Button
              variant={activeTab === "deliveries" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("deliveries")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Livraisons
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Box className="mr-2 h-4 w-4" />
              Produits
            </Button>
            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("customers")}
            >
              <Users className="mr-2 h-4 w-4" />
              Clients
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-auto" variant="destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des données...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tableau de bord</h1>
                    <Button>Actualiser</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <p className="text-xs text-muted-foreground">
                          +{Math.floor(Math.random() * 10)}% depuis le mois dernier
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Livraisons en attente
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {deliveryRequests.filter((d) => d.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {deliveryRequests.filter((d) => d.status === "processing").length} en cours de traitement
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{unreadCount}</div>
                        <p className="text-xs text-muted-foreground">{notifications.length} au total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revenus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {orders.reduce((total, order) => total + order.total, 0).toFixed(2)} €
                        </div>
                        <p className="text-xs text-muted-foreground">
                          +{Math.floor(Math.random() * 15)}% depuis le mois dernier
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dernières commandes</CardTitle>
                        <CardDescription>Aperçu des commandes récentes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.total.toFixed(2)} €</p>
                                <Badge variant={order.status === "En cours" ? "outline" : "default"}>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("orders")}>
                          Voir toutes les commandes
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Demandes de livraison récentes</CardTitle>
                        <CardDescription>Aperçu des demandes de livraison</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {deliveryRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{request.customer}</p>
                                <p className="text-sm text-muted-foreground">{request.address}</p>
                                <p className="text-xs text-muted-foreground">{request.date}</p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    request.status === "pending"
                                      ? "outline"
                                      : request.status === "processing"
                                        ? "secondary"
                                        : "default"
                                  }
                                >
                                  {request.status === "pending"
                                    ? "En attente"
                                    : request.status === "processing"
                                      ? "En cours"
                                      : "Terminé"}
                                </Badge>
                                <p className="text-sm mt-1">{request.country}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("deliveries")}>
                          Voir toutes les livraisons
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <Button variant="outline">Marquer tout comme lu</Button>
                  </div>
                  <Tabs defaultValue="all">
                    <TabsList>
                      <TabsTrigger value="all">Toutes</TabsTrigger>
                      <TabsTrigger value="order">Commandes</TabsTrigger>
                      <TabsTrigger value="delivery">Livraisons</TabsTrigger>
                      <TabsTrigger value="message">Messages</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <Card
                            key={notification.id}
                            className={`cursor-pointer transition-colors ${
                              !notification.read ? "border-l-4 border-l-pink-600" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    {notification.type === "order" && <ShoppingBag className="h-4 w-4 text-blue-500" />}
                                    {notification.type === "delivery" && <Truck className="h-4 w-4 text-green-500" />}
                                    {notification.type === "message" && <Bell className="h-4 w-4 text-yellow-500" />}
                                    <p className="font-medium">{notification.title}</p>
                                    {!notification.read && (
                                      <Badge variant="outline" className="ml-2">
                                        Nouveau
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                  {notification.type === "delivery" && notification.data && (
                                    <div className="mt-2 text-sm">
                                      <p>Adresse: {notification.data.address}</p>
                                      <p>Téléphone: {notification.data.phone}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {notification.date}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="order" className="mt-4">
                      <div className="space-y-4">
                        {notifications
                          .filter((notification) => notification.type === "order")
                          .map((notification) => (
                            <Card
                              key={notification.id}
                              className={`cursor-pointer transition-colors ${
                                !notification.read ? "border-l-4 border-l-pink-600" : ""
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <ShoppingBag className="h-4 w-4 text-blue-500" />
                                      <p className="font-medium">{notification.title}</p>
                                      {!notification.read && (
                                        <Badge variant="outline" className="ml-2">
                                          Nouveau
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {notification.date}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="delivery" className="mt-4">
                      <div className="space-y-4">
                        {notifications
                          .filter((notification) => notification.type === "delivery")
                          .map((notification) => (
                            <Card
                              key={notification.id}
                              className={`cursor-pointer transition-colors ${
                                !notification.read ? "border-l-4 border-l-pink-600" : ""
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Truck className="h-4 w-4 text-green-500" />
                                      <p className="font-medium">{notification.title}</p>
                                      {!notification.read && (
                                        <Badge variant="outline" className="ml-2">
                                          Nouveau
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                    {notification.data && (
                                      <div className="mt-2 text-sm">
                                        <p>Adresse: {notification.data.address}</p>
                                        <p>Téléphone: {notification.data.phone}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {notification.date}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="message" className="mt-4">
                      <div className="space-y-4">
                        {notifications
                          .filter((notification) => notification.type === "message")
                          .map((notification) => (
                            <Card
                              key={notification.id}
                              className={`cursor-pointer transition-colors ${
                                !notification.read ? "border-l-4 border-l-pink-600" : ""
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Bell className="h-4 w-4 text-yellow-500" />
                                      <p className="font-medium">{notification.title}</p>
                                      {!notification.read && (
                                        <Badge variant="outline" className="ml-2">
                                          Nouveau
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {notification.date}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {activeTab === "deliveries" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Demandes de livraison</h1>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="processing">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Actualiser</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {deliveryRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{request.id}</h3>
                                <Badge
                                  variant={
                                    request.status === "pending"
                                      ? "outline"
                                      : request.status === "processing"
                                        ? "secondary"
                                        : "default"
                                  }
                                >
                                  {request.status === "pending"
                                    ? "En attente"
                                    : request.status === "processing"
                                      ? "En cours"
                                      : "Terminé"}
                                </Badge>
                              </div>
                              <p className="text-sm">
                                <span className="font-medium">Client:</span> {request.customer}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Téléphone:</span> {request.phone}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Adresse:</span> {request.address}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Pays:</span> {request.country}
                              </p>
                              {request.instructions && (
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Instructions:</span> {request.instructions}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm text-muted-foreground">{request.date}</p>
                              <div className="flex flex-col gap-2 mt-2">
                                {request.status === "pending" && <Button size="sm">Traiter la demande</Button>}
                                {request.status === "processing" && <Button size="sm">Marquer comme terminé</Button>}
                                <Button variant="outline" size="sm">
                                  Contacter le client
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Commandes</h1>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Rechercher..."
                          className="pl-8 w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={orderFilter} onValueChange={setOrderFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="en cours">En cours</SelectItem>
                          <SelectItem value="expédié">Expédié</SelectItem>
                          <SelectItem value="livré">Livré</SelectItem>
                          <SelectItem value="annulé">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Actualiser</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-12 border rounded-lg">
                        <p className="text-muted-foreground">Aucune commande trouvée</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{order.id}</h3>
                                  <Badge
                                    variant={
                                      order.status === "En cours"
                                        ? "outline"
                                        : order.status === "Expédié"
                                          ? "secondary"
                                          : order.status === "Livré"
                                            ? "default"
                                            : "destructive"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <p className="text-sm">
                                  <span className="font-medium">Date:</span> {order.date}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Client:</span> {order.customerEmail || "Non spécifié"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Total:</span> {order.total.toFixed(2)} €
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Articles:</span> {order.items}
                                </p>
                                <div className="mt-2">
                                  <Button variant="link" size="sm" className="p-0 h-auto">
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Voir les détails
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm">Mettre à jour le statut</Button>
                                <Button variant="outline" size="sm">
                                  Imprimer la facture
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
