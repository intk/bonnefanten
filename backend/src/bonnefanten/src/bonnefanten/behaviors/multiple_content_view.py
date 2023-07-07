# -*- coding: utf-8 -*-
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import directives
from plone.supermodel import model
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IMultipleContentView(model.Schema):
    directives.fieldset(
        "multiple_content_view",
        label="Multiple Content View",
        fields=("multiple_content_view",),
    )

    multiple_content_view = schema.Bool(
        title="This is a multiple content page",
        required=False,
    )
