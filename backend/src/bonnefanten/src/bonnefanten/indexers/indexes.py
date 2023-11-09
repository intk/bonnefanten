from bonnefanten.content.artwork import IArtwork
from plone.indexer.decorator import indexer


@indexer(IArtwork)
def artwork_material(obj):
    return obj.ObjMaterialTxt


@indexer(IArtwork)
def artwork_type(obj):
    return obj.ObjObjectTypeTxt


@indexer(IArtwork)
def artwork_technique(obj):
    return obj.ObjTechniqueTxt

@indexer(IArtwork)
def artwork_date(obj):
    return str(obj.ObjDateFromTxt)

@indexer(IArtwork)
def artwork_author(obj):
    relations = getattr(obj, "authors", [])
    titles = []
    for relation in relations:
        if relation.isBroken():
            continue  # Skip broken relations
        target_object = relation.to_object
        title = target_object.Title().strip()  # Strip leading and trailing spaces
        titles.append(title)
    return titles
