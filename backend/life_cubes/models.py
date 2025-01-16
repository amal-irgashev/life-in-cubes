from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    week_index = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(4160)]  # 80 years * 52 weeks
    )
    day_of_week = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)]
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50)  # Store icon name/identifier
    color = models.CharField(max_length=50, blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (Week {self.week_index})"

    class Meta:
        ordering = ['week_index', 'day_of_week']
        indexes = [
            models.Index(fields=['user', 'week_index']),
            models.Index(fields=['user', 'created_at']),
        ] 