from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from comercio.models import Payment, Orden
import stripe
from django.conf import settings
from rest_framework import serializers
from comercio.models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'orden', 'payment_intent_id', 'amount', 'currency',
                 'status', 'created_at', 'updated_at', 'error_message']
        read_only_fields = ['payment_intent_id', 'status', 'created_at',
                          'updated_at', 'error_message']


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo mostrar los pagos del usuario actual y solo las ordenes succeeded o failed
        user = self.request.user
        return Payment.objects.filter(orden__usuario=user)

    # Actualizar payment status a 'succeeded' o 'failed'
    @action(detail=True, methods=['post'], url_path='update-status')
    def update_payment_status(self, request, pk=None):
        try:
            payment = self.get_object()
            # status = request.data.get('status')
            status = 'succeeded'

            if status not in ['succeeded', 'failed']:
                return Response({'error': 'Estado inválido'}, status=400)

            payment.status = status
            payment.save()

            return Response(PaymentSerializer(payment).data)

        except Payment.DoesNotExist:
            return Response({'error': 'Pago no encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


    @action(detail=False, methods=['post'], url_path='create-payment-intent')
    def create_payment_intent(self, request):
        try:
            orden_id = request.data.get('orden_id')
            orden = Orden.objects.get(id=orden_id, usuario=request.user)
            
            # Convertir el total a centavos
            amount = int(orden.total * 100)
            
            # Crear el PaymentIntent en Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='bob',  # o 'bob' para bolivianos
                metadata={
                    'orden_id': orden_id
                }
            )
            
            # Crear el registro de pago en la base de datos
            payment = Payment.objects.create(
                orden=orden,
                payment_intent_id=payment_intent.id,
                amount=orden.total,
                currency='BOB',  # o 'BOB' para bolivianos
                status='pending'
            )
            
            return Response({
                'clientSecret': payment_intent.client_secret,
                'payment': PaymentSerializer(payment).data
            })

        except Orden.DoesNotExist:
            return Response({
                'error': 'Orden no encontrada'
            }, status=404)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)