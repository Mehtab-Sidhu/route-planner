from django.db import models
import json

# Create your models here.
class Routes(models.Model):
    name = models.CharField(max_length=100)
    coordinates = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name