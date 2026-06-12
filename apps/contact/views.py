from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def contact_view(request: HttpRequest) -> HttpResponse:
    """Placeholder contact view — replaced in Phase 2."""
    return render(request, 'contact/contact.html')
