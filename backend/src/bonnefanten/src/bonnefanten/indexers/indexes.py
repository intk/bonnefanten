from bonnefanten.content.artwork import IArtwork
from plone.indexer.decorator import indexer


@indexer(IArtwork)
def artwork_material(obj):
    return obj.ObjMaterialTxt


@indexer(IArtwork)
def artwork_name(obj):
    return obj.ObjTitleTxt


@indexer(IArtwork)
def artwork_technique(obj):
    return obj.ObjTechniqueTxt
