from bonnefanten.content.artwork import IArtwork
from plone.indexer.decorator import indexer


@indexer(IArtwork)
def artwork_material(obj):
    # Retrieve the ObjMaterialTxt attribute, which could be None, a single material, or multiple materials
    materials = getattr(obj, "ObjMaterialTxt", None)

    # If it's a string, split by comma and strip each material of surrounding whitespace
    if isinstance(materials, str):
        materials_list = [
            material.strip() for material in materials.split(",") if material.strip()
        ]
    # If it's already a list or a tuple (or any iterable but string), just strip the materials
    elif hasattr(materials, "__iter__") and not isinstance(materials, str):
        materials_list = [
            material.strip() for material in materials if material.strip()
        ]
    # If it's None or empty string, return an empty list
    else:
        materials_list = []

    return materials_list


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
