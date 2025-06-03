from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import Cita


class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'


class CitaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
