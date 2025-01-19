from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    TagViewSet,
    EventViewSet,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    DashboardView,
    UserDetailView,
    register,
    logout_view,
    change_password,
    get_csrf_token,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'events', EventViewSet, basename='event')

# API URL patterns
urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/v1/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/register/', register, name='register'),
    path('api/v1/auth/logout/', logout_view, name='logout'),
    path('api/v1/auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/v1/auth/change-password/', change_password, name='change-password'),
    path('api/v1/auth/csrf/', get_csrf_token, name='csrf-token'),
    
    # Dashboard endpoint
    path('api/v1/dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # API endpoints
    path('api/v1/', include((router.urls, 'api_v1'))),
]