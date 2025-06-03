from django.db import models

class Orden(models.Model):
    usuario = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='ordenes'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=20, choices=[
            ('pendiente', 'Pendiente'),
            ('completada', 'Completada'),
            ('cancelada', 'Cancelada')
        ], default='pendiente'
    )
    comprobante_pago = models.ImageField(
        upload_to='comprobantes/', null=True, blank=True
    )
    productos = models.ManyToManyField(
        'Producto',
        through='OrdenItem',
        related_name='ordenes'
    )


    def __str__(self):
        return f'Orden {self.id} - Usuario: {self.usuario.username} - Total: {self.total}'