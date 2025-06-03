from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from comercio.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from comercio.models import TipoExamen


class TipoExamenSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoExamen
        fields = '__all__'


class TipoExamenViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = TipoExamen.objects.all()
    serializer_class = TipoExamenSerializer
