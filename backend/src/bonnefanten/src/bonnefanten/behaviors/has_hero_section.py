# -*- coding: utf-8 -*-
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import directives
from plone.supermodel import model
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IHeroSectionView(model.Schema):
    directives.fieldset(
        "has_hero_section",
        label="Hero Section",
        fields=("has_hero_section",),
    )

    has_hero_section = schema.Bool(
        title="Show hero section",
        required=False,
    )
