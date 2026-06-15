from django.contrib import admin

from .models import Experience, Project, Skill


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['role', 'company', 'period', 'is_current', 'order']
    list_filter = ['is_current']
    ordering = ['order']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order']
    list_filter = ['category']
    ordering = ['category', 'order']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'published', 'created_at']
    list_filter = ['is_featured', 'published']
    prepopulated_fields = {'slug': ('title',)}
