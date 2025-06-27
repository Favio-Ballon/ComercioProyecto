from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from decimal import Decimal

from comercio.models import Orden, Carrito, OrdenItem, CarritoItem

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = '__all__'
class OrdenViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer

    @action(detail=False, methods=['get'], url_path='usuario')
    def obtener_ordenes_usuario(self, request):
        user = request.user
        ordenes = Orden.objects.filter(usuario=user)
        serializer = self.get_serializer(ordenes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def crear_desde_carrito(self, request):
        try:
            # Obtener el carrito del usuario
            carrito = Carrito.objects.get(usuario=request.user)
            items_carrito = CarritoItem.objects.filter(carrito=carrito)

            if not items_carrito.exists():
                return Response({
                    'error': 'El carrito está vacío'
                }, status=400)

            # Calcular el total
            total = sum(
                item.cantidad * item.producto.precio
                for item in items_carrito
            )

            # Crear la orden
            orden = Orden.objects.create(
                usuario=request.user,
                total=total,
                estado='pendiente'
            )

            # Copiar items del carrito a la orden
            for item_carrito in items_carrito:
                OrdenItem.objects.create(
                    orden=orden,
                    producto=item_carrito.producto,
                    cantidad=item_carrito.cantidad,
                    precioUnitario=item_carrito.producto.precio
                )

            # # Limpiar el carrito
            # items_carrito.delete()

            return Response({
                'mensaje': 'Orden creada exitosamente',
                'orden_id': orden.id,
                'total': float(orden.total)
            }, status=201)

        except Carrito.DoesNotExist:
            return Response({
                'error': 'No se encontró el carrito'
            }, status=404)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)