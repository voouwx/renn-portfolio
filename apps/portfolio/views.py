from __future__ import annotations

from itertools import groupby
from operator import attrgetter

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import DetailView, ListView, TemplateView

from apps.blog.models import BlogPost
from apps.contact.forms import ContactForm

from .models import Experience, Project, Skill


class HomeView(TemplateView):
    """Homepage with hero, about, skills, and inline contact form."""

    template_name = 'portfolio/home.html'

    def get_context_data(self, **kwargs: object) -> dict[str, object]:
        """Build context with experiences, skills, projects, blog, and contact form."""
        context = super().get_context_data(**kwargs)
        context['experiences'] = Experience.objects.all()
        context['projects'] = Project.objects.filter(published=True)[:4]
        context['blog_posts'] = BlogPost.objects.filter(published=True)[:3]

        skills = Skill.objects.all()
        context['skills_grouped'] = {
            category: list(group)
            for category, group in groupby(skills, key=attrgetter('category'))
        }

        if 'contact_form' not in context:
            context['contact_form'] = ContactForm()

        return context

    def post(self, request: HttpRequest, *args: object, **kwargs: object) -> HttpResponse:
        """Process inline contact form submission from the homepage."""
        if 'contact_submit' not in request.POST:
            return self.get(request, *args, **kwargs)

        form = ContactForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            phone_display = data['phone'] or '—'
            email_body = (
                f"Name: {data['name']}\n"
                f"Email: {data['email']}\n"
                f"Phone: {phone_display}\n"
                f"Subject: {data['subject']}\n\n"
                f"Message:\n{data['message']}"
            )
            send_mail(
                subject=f"[Portfolio] {data['subject']}",
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
                fail_silently=False,
            )
            return redirect(f"{reverse('portfolio:home')}?sent=1#contact")

        return self.render_to_response(self.get_context_data(contact_form=form))


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
