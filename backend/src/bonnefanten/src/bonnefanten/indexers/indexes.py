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
    # Retrieve the ObjObjectTypeTxt attribute, which could be None, a single type, or multiple types
    types = getattr(obj, "ObjObjectTypeTxt", None)

    # If it's a string, split by comma and strip each type of surrounding whitespace
    if isinstance(types, str):
        types_list = [
            material.strip() for material in types.split(",") if material.strip()
        ]
    # If it's already a list or a tuple (or any iterable but string), just strip the techniques
    elif hasattr(types, "__iter__") and not isinstance(types, str):
        types_list = [material.strip() for material in types if material.strip()]
    # If it's None or empty string, return an empty list
    else:
        types_list = []

    return types_list


@indexer(IArtwork)
def artwork_technique(obj):
    # Retrieve the ObjTechniqueTxt attribute, which could be None, a single technique, or multiple techniques
    techniques = getattr(obj, "ObjTechniqueTxt", None)

    # If it's a string, split by comma and strip each technique of surrounding whitespace
    if isinstance(techniques, str):
        techniques_list = [
            material.strip() for material in techniques.split(",") if material.strip()
        ]
    # If it's already a list or a tuple (or any iterable but string), just strip the techniques
    elif hasattr(techniques, "__iter__") and not isinstance(techniques, str):
        techniques_list = [
            material.strip() for material in techniques if material.strip()
        ]
    # If it's None or empty string, return an empty list
    else:
        techniques_list = []

    return techniques_list


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


@indexer(IArtwork)
def Artwork_Collection_Group(obj):
    collections = getattr(obj, "ObjCollectionGrp", None)

    if isinstance(collections, str):
        collections_list = [
            collection.strip()
            for collection in collections.split("|")
            if collection.strip()
        ]
    elif hasattr(collections, "__iter__") and not isinstance(collections, str):
        collections_list = [
            collection.strip() for collection in collections if collection.strip()
        ]
    else:
        collections_list = []

    return collections_list
