from plone.api import portal
from plone.app.vocabularies.catalog import KeywordsVocabulary as BKV
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory


@implementer(IVocabularyFactory)
class KeywordsVocabulary(BKV):
    """KeywordsVocabulary"""

    def __init__(self, index):
        self.keyword_index = index


artwork_techniqueVocabularyFactory = KeywordsVocabulary("artwork_technique")

artwork_materialVocabularyFactory = KeywordsVocabulary("artwork_material")

artwork_typeVocabularyFactory = KeywordsVocabulary("artwork_type")


# from plone.api import content
# from zope.schema.interfaces import ISource
# @implementer(ISource)
# class AuthorSource:
#     """ """
#
#     def __init__(self, context=None):
#         pass
#
#     def __contains__(self, value):
#         """used during validation to make sure the selected item is found with
#         the specified query.
#         value can be either a string (hex value of uuid or path) or a plone
#         content object.
#         """
#         query = {"authorID": str(value)}
#
#         return bool(self.search_catalog(query))
#
#     def search_catalog(self, authorID):
#         res = content.find(
#             context=portal.get(), portal_type="author", authorID=authorID
#         )
#         return res
