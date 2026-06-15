from __future__ import annotations

import mistune
from django.views.generic import DetailView, ListView

from .models import BlogPost


class PostListView(ListView):
    """List all published blog posts."""

    model = BlogPost
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    queryset = BlogPost.objects.filter(published=True)


class PostDetailView(DetailView):
    """Detail page for a single blog post with Markdown body rendered to HTML."""

    model = BlogPost
    template_name = 'blog/post_detail.html'
    context_object_name = 'post'
    slug_field = 'slug'

    def get_context_data(self, **kwargs: object) -> dict[str, object]:
        """Add rendered Markdown HTML to template context."""
        context = super().get_context_data(**kwargs)
        post: BlogPost = context['post']
        context['body_html'] = mistune.html(post.body)
        return context

    def get_queryset(self):
        """Only allow access to published posts."""
        return super().get_queryset().filter(published=True)
