from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import UserProfile, Tag, Event
from .serializers import (
    UserProfileSerializer,
    TagSerializer,
    EventSerializer,
    UserSerializer
)
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                user = User.objects.get(username=request.data['username'])
                user_data = UserSerializer(user).data
                response.data['user'] = user_data
                # Add token type for clarity
                response.data['token_type'] = 'Bearer'
            return response
        except Exception as e:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            response.data['token_type'] = 'Bearer'
            return response
        except TokenError:
            return Response(
                {'error': 'Invalid or expired refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        # Validate password
        validate_password(request.data['password'])
        
        # Create user
        user = User.objects.create_user(
            username=request.data['username'],
            email=request.data.get('email', ''),
            password=request.data['password'],
            first_name=request.data.get('first_name', ''),
            last_name=request.data.get('last_name', '')
        )
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            birth_date=request.data.get('birth_date')
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'token_type': 'Bearer',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
        
    except ValidationError as e:
        return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Tag.objects.filter(events__user=self.request.user).distinct()

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['week_index', 'day_of_week']
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['week_index', 'day_of_week', 'created_at']
    ordering = ['week_index', 'day_of_week']

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user).prefetch_related('tags')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def week_range(self, request):
        """Get events within a specific week range."""
        start_week = request.query_params.get('start_week', None)
        end_week = request.query_params.get('end_week', None)

        if not all([start_week, end_week]):
            return Response(
                {"error": "Both start_week and end_week parameters are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(
            week_index__gte=start_week,
            week_index__lte=end_week
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        # Get user's profile
        try:
            profile = user.profile
            # Get recent events
            recent_events = Event.objects.filter(user=user).order_by('-created_at')[:5]
            # Get all tags
            tags = Tag.objects.filter(user=user)
            
            data = {
                'user': {
                    'username': user.username,
                    'email': user.email,
                },
                'recent_events': EventSerializer(recent_events, many=True).data,
                'tags': TagSerializer(tags, many=True).data,
                'total_events': Event.objects.filter(user=user).count(),
                'total_tags': tags.count(),
            }
            return Response(data)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch dashboard data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
