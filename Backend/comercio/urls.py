from django.urls import path, include
from rest_framework import routers

from comercio.apis import UserViewSet, AuthViewSet, OrdenViewSet, CarritoViewSet, CategoriaViewSet, CitaViewSet, ProductoViewSet, TipoExamenViewSet, PaymentViewSet

router = routers.DefaultRouter()
router.register('usuarios', UserViewSet, basename='usuarios')
router.register("auth", AuthViewSet, basename='auth')
router.register('ordenes', OrdenViewSet, basename='ordenes')
router.register('carrito', CarritoViewSet, basename='carrito')
router.register('categorias', CategoriaViewSet, basename='categorias')
router.register('citas', CitaViewSet, basename='citas')
router.register('productos', ProductoViewSet, basename='productos')
router.register('tipo_examenes', TipoExamenViewSet, basename='tipo_examenes')

router.register('pagos', PaymentViewSet, basename='create-payment-intent'),




urlpatterns = [
    path('', include(router.urls)),
]