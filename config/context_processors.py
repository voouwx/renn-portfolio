"""Template context processors."""

from __future__ import annotations

from django.conf import settings


def social_links(request: object) -> dict[str, list[dict[str, str]]]:
    """Expose social profile links to all templates."""
    return {'social_links': settings.SOCIAL_LINKS}
