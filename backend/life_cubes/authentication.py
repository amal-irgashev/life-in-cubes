from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.middleware.csrf import CsrfViewMiddleware

def enforce_csrf(request):
    """
    Enforce CSRF validation for session based authentication.
    """
    check = CSRFCheck(CsrfViewMiddleware)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        # First, try to get the token from the Authorization header
        if header:
            raw_token = self.get_raw_token(header)
            if raw_token:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token

        # If no token in header, try to get it from cookies
        access_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if not access_token:
            return None

        validated_token = self.get_validated_token(access_token.encode())
        
        # For cookie based authentication, enforce CSRF check
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            enforce_csrf(request)

        return self.get_user(validated_token), validated_token

    def authenticate_header(self, request):
        return 'Bearer realm="api"' 