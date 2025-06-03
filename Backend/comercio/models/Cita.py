from django.db import models

class Cita(models.Model):
    usuario = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='citas', null=True, blank=True
    )
    fecha = models.DateTimeField()
    hora = models.TimeField()
    estado = models.CharField(
        max_length=20, choices=[('pendiente', 'Pendiente'), ('confirmada', 'Confirmada'), ('cancelada', 'Cancelada')], default='pendiente'
    )



    def __str__(self):
        return f"Cita {self.id} - Usuario: {self.usuario.username if self.usuario else 'Anónimo'} - Fecha: {self.fecha} - Hora: {self.hora} - Estado: {self.estado}"