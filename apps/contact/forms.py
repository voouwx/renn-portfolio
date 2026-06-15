from __future__ import annotations

import re

from django import forms
from django.core.exceptions import ValidationError


class ContactForm(forms.Form):
    """Contact form with server-side validation for portfolio inquiries."""

    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    phone = forms.CharField(
        max_length=20,
        required=False,
        help_text='Format: 08xx atau +62xx (opsional)',
    )
    subject = forms.CharField(max_length=200)
    message = forms.CharField(widget=forms.Textarea)

    def clean_name(self) -> str:
        """Strip whitespace and require at least 2 characters."""
        name = self.cleaned_data['name'].strip()
        if len(name) < 2:
            raise ValidationError('Nama minimal 2 karakter.')
        return name

    def clean_phone(self) -> str:
        """Sanitize and validate Indonesian phone format when provided."""
        phone = self.cleaned_data.get('phone', '').strip()
        if not phone:
            return ''

        sanitized = re.sub(r'[\s\-()]', '', phone)
        if not re.match(r'^(\+62|62|0)8[0-9]{8,11}$', sanitized):
            raise ValidationError('Format nomor HP tidak valid. Gunakan 08xx atau +62xx.')
        return sanitized

    def clean_message(self) -> str:
        """Strip whitespace and require at least 20 characters."""
        message = self.cleaned_data['message'].strip()
        if len(message) < 20:
            remaining = 20 - len(message)
            raise ValidationError(f'Pesan minimal 20 karakter. Sisa {remaining} karakter.')
        return message
