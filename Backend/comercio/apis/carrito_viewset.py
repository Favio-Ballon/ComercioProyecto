from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from comercio.apis.producto_viewset import ProductoSerializer
from comercio.models import Carrito, Producto, CarritoItem


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()

    class Meta:
        model = CarritoItem
        fields = ['id', 'cantidad', 'producto']


class CarritoSerializer(serializers.ModelSerializer):
    carrito_items = CarritoItemSerializer(source='items', many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'carrito_items']


class CarritoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer

    def get_queryset(self):
        user = self.request.user
        return Carrito.objects.filter(usuario=user)

    @action(detail=False, methods=['post'], url_path='add')
    def add_producto(self, request):
        carrito = Carrito.objects.get(usuario=request.user)
        producto = request.data.get('producto')
        cantidad = request.data.get('cantidad')
        if not producto or not cantidad:
            return Response({'error': 'El ID del producto y la calidad son requeridos'}, status=400)

        try:
            producto = Producto.objects.get(id=producto)
            if producto in carrito.productos.all():
                return Response({'error': 'El producto ya está en el carrito'}, status=400)
            CarritoItem.objects.create(
                carrito=carrito,
                producto=producto,
                cantidad=cantidad
            )

            return Response({'status': 'Producto añadido al carrito'}, status=200)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='remove')
    def remove_producto(self, request):
        carrito = Carrito.objects.get(usuario=request.user)
        if not carrito:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        producto_id = request.data.get('producto')

        # convert producto_id to int if it's a string
        try:
            producto_id = int(producto_id)
        except (ValueError, TypeError):
            return Response({'error': 'El ID del producto debe ser un número entero'}, status=400)

        if not producto_id:
            return Response({'error': 'El ID del producto es requerido'}, status=400)
        print(carrito.id)
        print(producto_id)

        try:
            carrito_item = CarritoItem.objects.filter(
                carrito=carrito,
                producto_id=producto_id
            ).first()

            if not carrito_item:
                return Response({'error': 'El producto no está en el carrito'}, status=400)

            carrito_item.delete()
            return Response({'status': 'Producto eliminado del carrito'}, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    # metodo eliminar todos los items del carrito
    @action(detail=False, methods=['post'], url_path='limpiar')
    def limpiar_carrito(self, request):
        try:
            carrito = Carrito.objects.get(usuario=request.user)
            carrito.items.all().delete()  # Elimina todos los items del carrito
            return Response({'status': 'Carrito limpiado exitosamente'}, status=200)
        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)