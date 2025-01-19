from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.core.exceptions import PermissionDenied

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, Exception):
            data = {
                'error': str(exc),
                'detail': 'An unexpected error occurred.'
            }
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return None

    # Handle JWT token errors
    if isinstance(exc, (InvalidToken, TokenError)):
        response.data = {
            'error': 'Token is invalid or expired',
            'code': 'token_invalid',
            'detail': str(exc)
        }
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    # Handle CSRF errors
    if isinstance(exc, PermissionDenied) and 'CSRF' in str(exc):
        response.data = {
            'error': 'CSRF validation failed',
            'code': 'csrf_failed',
            'detail': str(exc)
        }
        response.status_code = status.HTTP_403_FORBIDDEN
        return response

    # Standardize error response format
    if response is not None:
        error_data = {
            'error': str(exc),
            'code': exc.__class__.__name__,
            'detail': response.data if hasattr(response, 'data') else str(exc)
        }
        response.data = error_data

    return response 