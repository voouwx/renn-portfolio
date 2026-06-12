from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def post_list(request: HttpRequest) -> HttpResponse:
    """Placeholder blog list view — replaced in Phase 2."""
    return render(request, 'blog/post_list.html')
