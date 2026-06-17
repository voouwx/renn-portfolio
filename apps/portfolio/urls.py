from django.http import HttpResponseRedirect
from django.urls import path, reverse

from .views import HomeView, ProjectDetailView, ProjectListView

app_name = 'portfolio'


def contact_redirect(request: object) -> HttpResponseRedirect:
    """Redirect legacy /contact/ URL to homepage contact section."""
    return HttpResponseRedirect(f"{reverse('portfolio:home')}#contact")


urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('contact/', contact_redirect, name='contact'),
    path('projects/', ProjectListView.as_view(), name='project_list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project_detail'),
]
