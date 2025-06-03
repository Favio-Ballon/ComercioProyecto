from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from comercio.models import Carrito
from comercio.models import Usuario


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'username', 'is_staff', 'is_active')


class UserViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='all')
    def get_all_users(self, request):
        if not request.user.is_staff:
            return Response({'error': 'No tienes permiso para ver todos los usuarios'}, status=403)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class AuthViewSet(viewsets.ViewSet):

    @action(methods=['post'], detail=False, url_path='register')
    def register(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        username = request.data.get('username')
        direccion = request.data.get('direccion')
        telefono = request.data.get('telefono')

        if not password or not username or not email:
            return Response({'error': 'El email y la contraseña son requeridos'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'El email ya está en uso'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya está en uso'}, status=400)
        if not nombre or not apellido:
            return Response({'error': 'El nombre y apellido son requeridos'}, status=400)
        if not direccion or not telefono:
            return Response({'error': 'La dirección y el teléfono son requeridos'}, status=400)
        user = User.objects.create_user(username, email, password, first_name=nombre, last_name=apellido)
        usuario = Usuario.objects.create(user=user, direccion=direccion, telefono=telefono)
        usuario.save()
        # cliente_group = Group.objects.get(name='Cliente')
        # user.groups.add(cliente_group)

        # Se crea el carrito de compras para el usuario
        carrito = Carrito.objects.create(usuario=user)
        carrito.save()
        return Response({'id': user.id, 'email': user.email}, status=201)

    @action(methods=['post'], detail=False, url_path='login')
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=400)

        user = authenticate(username=username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

