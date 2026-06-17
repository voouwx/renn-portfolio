from __future__ import annotations

from itertools import groupby
from operator import attrgetter

from django.views.generic import DetailView, ListView, TemplateView

from apps.blog.models import BlogPost

from .models import Experience, Project, Skill


class HomeView(TemplateView):
    """Homepage with hero, about, skills, experience, projects, blog, and contact."""

    template_name = 'portfolio/home.html'

    def get_context_data(self, **kwargs: object) -> dict[str, object]:
        """Build context with experiences, skills, projects, and blog posts."""
        context = super().get_context_data(**kwargs)
        context['experiences'] = Experience.objects.all()
        context['projects'] = Project.objects.filter(published=True)[:4]
        context['blog_posts'] = BlogPost.objects.filter(published=True)[:3]

        skills = Skill.objects.all()
        context['skills_grouped'] = {
            category: list(group)
            for category, group in groupby(skills, key=attrgetter('category'))
        }

        return context


class ProjectListView(ListView):
    """List all published portfolio projects."""

    model = Project
    template_name = 'portfolio/project_list.html'
    context_object_name = 'projects'
    queryset = Project.objects.filter(published=True)


class ProjectDetailView(DetailView):
    """Detail page for a single published project."""

    model = Project
    template_name = 'portfolio/project_detail.html'
    context_object_name = 'project'
    slug_field = 'slug'

    def get_queryset(self):
        """Only allow access to published projects."""
        return super().get_queryset().filter(published=True)
