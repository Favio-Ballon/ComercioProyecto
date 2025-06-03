from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
