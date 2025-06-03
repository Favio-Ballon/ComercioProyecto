from django.db import models

class Carrito(models.Model):
    usuario = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='carritos', null=True, blank=True
    )
    productos = models.ManyToManyField(
        'Producto',
        through='CarritoItem',
        related_name='carritos'
    )

    def __str__(self):
        return f"Carrito de {self.usuario.username if self.usuario else 'Invitado'}"