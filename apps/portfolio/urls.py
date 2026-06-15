from django.urls import path

from .views import HomeView, ProjectDetailView, ProjectListView

app_name = 'portfolio'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('projects/', ProjectListView.as_view(), name='project_list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project_detail'),
]
