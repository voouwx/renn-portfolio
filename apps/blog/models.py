from __future__ import annotations

import math

from django.db import models


class BlogPost(models.Model):
    """Blog post with Markdown body and optional excerpt."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    excerpt = models.CharField(max_length=300, blank=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title

    @property
    def reading_time(self) -> int:
        """Return estimated reading time in minutes (200 words per minute)."""
        word_count = len(self.body.split())
        if word_count == 0:
            return 1
        return max(1, math.ceil(word_count / 200))
