from django.contrib import admin
from .models import Routes

# Register your models here.
@admin.register(Routes)
class RoutesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)
    readonly_fields = ('coordinates',)