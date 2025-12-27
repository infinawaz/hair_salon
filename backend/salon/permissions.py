from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to superusers."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class IsStaffOrReadOnly(permissions.BasePermission):
    """Allow read to anyone, write only to staff or superuser."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
