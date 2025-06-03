from django.db import models

class CarritoItem(models.Model):
    cantidad = models.IntegerField(default=1)
    carrito = models.ForeignKey('Carrito', on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE, related_name='carrito_items')

    def __str__(self):
        return f"CarritoItem {self.id} - Producto: {self.producto.nombre} - Cantidad: {self.cantidad}"