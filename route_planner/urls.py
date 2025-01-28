"""
URL configuration for route_planner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.shortcuts import render
from routes import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('export_kml/', views.export_kml, name='export_kml'),
    path('export_gpx/', views.export_gpx, name='export_gpx'),
    path('save_route/', views.save_route, name='save_route'),
    path('get_all_routes/', views.get_all_routes, name='get_all_routes'),
    path('load_route/<int:route_id>/', views.load_route, name='load_route'),
]
