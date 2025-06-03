from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import Orden


class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = '__all__'


class OrdenViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer

