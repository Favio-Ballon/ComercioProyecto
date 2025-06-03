from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.categoria_viewset import CategoriaSerializer
from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import Producto, Categoria


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        source='categoria',
        queryset=Categoria.objects.all(),
        write_only=True
    )

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'categoria_id', 'imagen']


class ProductoViewSet(viewsets.ModelViewSet):
    # permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
