from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import simplekml
import gpxpy
import gpxpy.gpx
from .models import Routes
from django.views.decorators.csrf import csrf_exempt
import json
import logging

# Create your views here.

def export_kml(request):
    route_data = request.GET.get('route')
    route_points = eval(route_data)

    # KML object
    kml = simplekml.Kml()
    line = kml.newlinestring(name="Route", coords=route_points)

    # response with kml file
    response = HttpResponse(content_type='application/xml')
    response['Content-Disposition'] = 'attachment; filename="route.kml"'
    response.write(kml.kml())
    return response

def export_gpx(request):
    route_data = request.GET.get('route')  
    route_points = eval(route_data)  
    
    # GPX object
    gpx = gpxpy.gpx.GPX()
    track = gpxpy.gpx.GPXTrack()
    gpx.tracks.append(track)
    segment = gpxpy.gpx.GPXTrackSegment()
    track.segments.append(segment)
    
    # Add points
    for point in route_points:
        lat, lon = point
        segment.points.append(gpxpy.gpx.GPXTrackPoint(lat, lon))
    
    # response with GPX file
    response = HttpResponse(content_type='application/gpx+xml')
    response['Content-Disposition'] = 'attachment; filename="route.gpx"'
    response.write(gpx.to_xml())
    return response

@csrf_exempt
def save_route(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            coordinates = data.get('coordinates')

            if not name or not coordinates:
                return JsonResponse({'error': 'Invalid data'}, status=400)

            route = Routes(name=name, coordinates=coordinates)
            route.save()
            return JsonResponse({'route_id': route.id})
        except Exception as e:
            logging.error(f"Error saving route: {e}")
            return JsonResponse({'error': 'Failed to save route'}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)


def index(request):
    routes = Routes.objects.all()
    return render(request, 'index.html', {'routes': routes})

def get_all_routes(request):
    routes = Routes.objects.all()
    routes_data = [{'id': route.id, 'name': route.name, 'coordinates': route.coordinates} for route in routes]
    return JsonResponse({"routes": routes_data})

def load_route(request, route_id):
    try:
        route = Routes.objects.get(id=route_id)
        print(f"Route Coordinates: {route.coordinates}")
        return JsonResponse({'route': {'coordinates': route.coordinates}})

    except Routes.DoesNotExist:
        return JsonResponse({'error': 'Route not found'}, status=404)