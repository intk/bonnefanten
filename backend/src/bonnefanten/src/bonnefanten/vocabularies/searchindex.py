from plone.api import portal
from plone.app.vocabularies.catalog import KeywordsVocabulary as BKV
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@implementer(IVocabularyFactory)
class KeywordsVocabulary(BKV):
    """KeywordsVocabulary"""

    def __init__(self, index):
        self.keyword_index = index


@implementer(IVocabularyFactory)
class ArtworkMaterialVocabulary(KeywordsVocabulary):
    def __call__(self, context):
        # Call the base implementation to get the basic vocabulary
        vocabulary = super(ArtworkMaterialVocabulary, self).__call__(context)

        # Split the terms here, assuming they are stored as a single string in the catalog
        # Adjust the splitting logic based on how your data is actually stored
        all_terms = set()
        for term in vocabulary:
            # Here you split the term by a specific separator, like a comma
            split_terms = term.title.split(",")
            for split_term in split_terms:
                split_term = split_term.strip()
                if split_term and split_term not in all_terms:
                    all_terms.add(split_term)

        # Create a new SimpleVocabulary from the split terms
        return SimpleVocabulary(
            [SimpleTerm(value=term, title=term) for term in all_terms]
        )


artwork_techniqueVocabularyFactory = KeywordsVocabulary("artwork_technique")

artwork_materialVocabularyFactory = ArtworkMaterialVocabulary("artwork_material")

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
