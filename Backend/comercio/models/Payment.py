from django.db import models


class Payment(models.Model):
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE, related_name='payments')
    payment_intent_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('succeeded', 'Exitoso'),
            ('failed', 'Fallido'),
            ('refunded', 'Reembolsado'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.payment_intent_id} - Order {self.orden.id} - {self.status}"

    def save(self, *args, **kwargs):
        # Actualizar el estado de la orden cuando el pago es exitoso
        if self.status == 'succeeded' and self.orden.estado != 'completada':
            self.orden.estado = 'completada'
            self.orden.save()
        super().save(*args, **kwargs)