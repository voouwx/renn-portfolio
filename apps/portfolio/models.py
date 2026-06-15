from __future__ import annotations

from django.db import models
from django.db.models import QuerySet
from django.urls import reverse


class Experience(models.Model):
    """Work or internship experience for the portfolio homepage."""

    role = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    period = models.CharField(max_length=50)
    description = models.TextField()
    is_current = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self) -> str:
        return f'{self.role} at {self.company}'


class Skill(models.Model):
    """Skill tag grouped by category for the portfolio homepage."""

    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    proficiency = models.IntegerField(default=80)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['category', 'order']

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    """Portfolio project entry with optional links and featured flag."""

    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    tech_stack = models.CharField(max_length=300)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True)
    is_featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    created_at = models.DateField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title

    def get_absolute_url(self) -> str:
        """Return canonical URL for this project detail page."""
        return reverse('portfolio:project_detail', kwargs={'slug': self.slug})

    @property
    def tech_list(self) -> list[str]:
        """Return tech stack as a list parsed from comma-separated string."""
        return [tech.strip() for tech in self.tech_stack.split(',') if tech.strip()]

    @classmethod
    def get_featured(cls) -> QuerySet[Project]:
        """Return published projects marked as featured for the homepage."""
        return cls.objects.filter(is_featured=True, published=True)
