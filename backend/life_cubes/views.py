from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
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
from django.conf import settings
from datetime import datetime
from django.middleware.csrf import get_token
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import never_cache

def set_auth_cookies(response, access_token, refresh_token):
    """Helper function to set authentication cookies"""
    response.set_cookie(
        settings.SIMPLE_JWT['AUTH_COOKIE'],
        access_token,
        expires=datetime.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
    )
    response.set_cookie(
        settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
        refresh_token,
        expires=datetime.now() + settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
    )

def clear_auth_cookies(response):
    """Helper function to clear authentication cookies"""
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    return response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                user = User.objects.get(username=request.data['username'])
                user_data = UserSerializer(user).data
                
                # Set cookies
                set_auth_cookies(
                    response,
                    response.data['access'],
                    response.data['refresh']
                )
                
                # Update response data
                response.data = {
                    'user': user_data,
                    'message': 'Successfully logged in'
                }
            return response
        except Exception as e:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # Get refresh token from cookie
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            if not refresh_token:
                return Response(
                    {'error': 'No refresh token provided'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Set new access token in cookie
                set_auth_cookies(
                    response,
                    response.data['access'],
                    response.data.get('refresh', refresh_token)  # Use new refresh token if provided
                )
                
                # Clean response data
                response.data = {'message': 'Token refreshed successfully'}
            
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
        # Check if username already exists
        username = request.data['username']
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Validate password
        validate_password(request.data['password'])
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=request.data.get('email', ''),
            password=request.data['password'],
            first_name=request.data.get('first_name', ''),
            last_name=request.data.get('last_name', '')
        )
        
        # Create user profile with birth_date
        birth_date = request.data.get('birth_date')
        if birth_date:
            try:
                UserProfile.objects.create(
                    user=user,
                    birth_date=birth_date
                )
            except Exception as e:
                # If profile creation fails, delete the user and raise error
                user.delete()
                raise Exception(f'Invalid birth date format: {str(e)}')
        else:
            UserProfile.objects.create(user=user)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            'user': UserSerializer(user).data,
            'message': 'Successfully registered'
        }, status=status.HTTP_201_CREATED)
        
        # Set cookies
        set_auth_cookies(
            response,
            str(refresh.access_token),
            str(refresh)
        )
        
        return response
        
    except ValidationError as e:
        return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@require_http_methods(["POST"])
@never_cache
def logout_view(request):
    """
    Logout view that clears auth cookies.
    CSRF protection is disabled for this view since we're just clearing cookies.
    """
    response = JsonResponse({'detail': 'Successfully logged out'})
    clear_auth_cookies(response)
    
    # Add CORS headers
    response["Access-Control-Allow-Credentials"] = "true"
    response["Access-Control-Allow-Origin"] = request.headers.get("Origin") or "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    
    return response

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile with user data"""
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

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
    pagination_class = None  # Disable pagination for this viewset

    def get_queryset(self):
        """Get events for the current user."""
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a new event for the current user."""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Update an event, ensuring it belongs to the current user."""
        event = self.get_object()
        if event.user != self.request.user:
            raise PermissionError("You don't have permission to edit this event.")
        serializer.save()

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

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get user with profile
        user = request.user
        try:
            # Ensure profile exists
            profile, created = UserProfile.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Failed to get user data: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            user = request.user
            profile = user.profile

            # Update user data if provided
            user_data = {
                'first_name': request.data.get('first_name'),
                'last_name': request.data.get('last_name'),
                'email': request.data.get('email')
            }
            user_data = {k: v for k, v in user_data.items() if v is not None}
            
            if user_data:
                user_serializer = UserSerializer(user, data=user_data, partial=True)
                if user_serializer.is_valid():
                    user_serializer.save()

            # Update profile data if provided
            profile_data = {
                'birth_date': request.data.get('birth_date')
            }
            profile_data = {k: v for k, v in profile_data.items() if v is not None}
            
            if profile_data:
                profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()

            # Return updated user data
            return Response(UserSerializer(user).data)
        except Exception as e:
            return Response(
                {'error': f'Failed to update user data: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        # Validate old password
        if not request.user.check_password(request.data['old_password']):
            return Response(
                {'error': 'Invalid old password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate and set new password
        validate_password(request.data['new_password'])
        request.user.set_password(request.data['new_password'])
        request.user.save()
        
        return Response({'message': 'Password updated successfully'})
        
    except ValidationError as e:
        return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:
        return Response(
            {'error': 'Both old_password and new_password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Get CSRF token for the client."""
    return JsonResponse({'csrfToken': get_token(request)})
