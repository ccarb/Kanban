from rest_framework import permissions

class IsPublicOrIsOwnerOrNotAllowed(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to view and edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `owner`.
        # Can edit public boards
        if obj.owner==None:
            return True
        # else must be owner
        return obj.owner == request.user