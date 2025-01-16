from django.contrib import admin
from .models import UserProfile, Tag, Event

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'birth_date', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at', 'updated_at')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'week_index', 'day_of_week', 'created_at')
    list_filter = ('user', 'tags', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'user__username')
    filter_horizontal = ('tags',)
    ordering = ('week_index', 'day_of_week')
