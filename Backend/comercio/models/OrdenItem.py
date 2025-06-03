from django.db import models

class OrdenItem(models.Model):
    cantidad = models.IntegerField(default=1)
    precioUnitario = models.DecimalField(max_digits=10, decimal_places=2)
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE, related_name='orden')
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE, related_name='orden_items')

    def __str__(self):
        return f"OrdenItem {self.id} - Producto: {self.producto.nombre} - Cantidad: {self.cantidad}"