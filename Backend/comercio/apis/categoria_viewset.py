from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class CategoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
