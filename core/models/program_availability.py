from django.db import models
from core.models import Program

class ProgramAvailability(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length = 10)
    start_time = models.TimeField()
    end_time = models.TimeField()