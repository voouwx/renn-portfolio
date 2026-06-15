from __future__ import annotations

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import ContactForm


def contact_view(request: HttpRequest) -> HttpResponse:
    """
    Handle contact form display and submission.

    GET renders an empty form. POST validates input and sends email notification
    on success, then redirects with ?sent=1.
    """
    if request.method == 'POST':
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
            return redirect(f"{reverse('contact:contact')}?sent=1")
    else:
        form = ContactForm()

    return render(request, 'contact/contact.html', {'form': form})
