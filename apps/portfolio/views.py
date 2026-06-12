from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def home(request: HttpRequest) -> HttpResponse:
    """Placeholder home view — replaced in Phase 1 hero section."""
    return render(request, 'portfolio/home.html')


def project_list(request: HttpRequest) -> HttpResponse:
    """Placeholder project list view — replaced in Phase 2."""
    return render(request, 'portfolio/project_list.html')


def project_detail(request: HttpRequest, slug: str) -> HttpResponse:
    """Placeholder project detail view — replaced in Phase 2."""
    return render(request, 'portfolio/project_detail.html', {'slug': slug})
