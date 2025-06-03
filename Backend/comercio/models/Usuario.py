from django.db import models

class Usuario(models.Model):
    direccion = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)

    def __str__(self):
     return self.direccion