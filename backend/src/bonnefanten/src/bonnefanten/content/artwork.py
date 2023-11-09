from plone.app.dexterity.textindexer.directives import searchable
from plone.app.multilingual.dx import directives as lang_directives
from plone.app.z3cform.widget import RelatedItemsFieldWidget
from plone.autoform import directives as form_directives
from plone.namedfile.field import NamedBlobImage
from plone.supermodel import model
from z3c.relationfield.schema import RelationChoice
from z3c.relationfield.schema import RelationList
from zope import schema


#   Object 11678.xml
#
#   "__lastModified" : "2023-01-12 22:59:11.549",
#   "Id" : 11678,
#  "ObjDimensionTxt" : "140 cm (geheel)\n700 cm (geheel)",
#   "ObjMaterialTxt" : "polyester, zijde, trevira cs, acryl, wol, katoen",
#   "ObjObjectNumberTxt" : "1005953",
#   "ObjTitleTxt" : "",
#   "Thumbnails" : [ {
#     "DefaultBoo" : true,
#     "__lastModified" : "2022-07-01T12:00:00",
#     "Sizes" : {
#       "ExtraSmallUri" : "/ria-ws/application/module/Multimedia/10112/
#           thumbnail?size=EXTRA_SMALL",
#       "SmallUri" : "/ria-ws/application/module/Multimedia/10112/
#           thumbnail?size=SMALL",
#       "MediumUri" : "/ria-ws/application/module/Multimedia/10112/
#           thumbnail?size=MEDIUM",
#       "LargeUri" : "/ria-ws/application/module/Multimedia/10112/
#           thumbnail?size=LARGE",
#       "ExtraLargeUri" : "/ria-ws/application/module/Multimedia/10112/
#           thumbnail?size=EXTRA_LARGE"
#     }
#   } ],
#   "ObjCreditlineTxt" : "Collectie Bonnefanten, verworven met steun van de
#       VriendenLoterij.",
#   "ObjTechniqueTxt" : "geweven",
#   "ObjCurrentLocationTxt" : " -> Entree begane grond",
#   "ObjCategoryTxt" : "textilia",
#   "ObjObjectTypeTxt" : "wandtapijt",
#   "ObjDateFromTxt" : "2009",
#   "ObjDateToTxt" : "2009",
#   "ObjDateNotesTxt" : null,
#   "ObjAcquisitionMethodTxt" : {
#     "NodeId" : 222107,
#     "LabelTxt_nl" : "aankoop",
#     "LabelTxt_en" : "aankoop"
#   },
#   "ObjAcquisitionDateTxt" : "2014-12-17",
#   "ObjHistoricLocationTxt" : "ad vs 2 midden",
#   "ObjMultimediaRef" : {
#     "ModuleTxt" : "Multimedia",
#     "TotalSizeLnu" : 0,
#     "Items" : [ ]
#   },
#   "ObjPersonRef" : {
#     "ModuleTxt" : "Person",
#     "TotalSizeLnu" : 2,
#     "Items" : [ {
#       "LinkLabelTxt" : "Grayson Perry",
#       "ReferencedId" : 4691,
#       "PerSortNameTxt" : "Perry Perry, Grayson Perry, Grayson",
#       "RoleTxt" : {
#         "NodeId" : 222161,
#         "LabelTxt_nl" : "kunstenaar",
#         "LabelTxt_en" : "kunstenaar"
#       },
#       "PerBirthDateTxt" : "24-03-1960"
#     }, {
#       "LinkLabelTxt" : "Flanders Tapestry",
#       "ReferencedId" : 4712,
#       "PerSortNameTxt" : "Flanders Tapestry Flanders Tapestry Flanders Tapestry",
#       "RoleTxt" : {
#         "NodeId" : 222179,
#         "LabelTxt_nl" : "wever",
#         "LabelTxt_en" : "wever"
#       },
#       "PerBirthDateTxt" : null
#     } ]
#   },
#   "ObjRightsGrp" : [ {
#     "ConsentStatusTxt" : {
#       "NodeId" : 161652,
#       "LabelTxt_en" : "2"
#     },
#     "NotesTxt" : null
#   } ]
# } ]


class IArtwork(model.Schema):
    """Schema for Artwork content type."""

    # previewImage = NamedBlobImage(
    #     title=u"Preview Image",
    #     description=u"Image that will be used as a preview for this artwork.",
    #     required=False,
    # )
    ObjDimensionTxt = schema.TextLine(title="ObjDimensionTxt", required=False)
    ObjMaterialTxt = schema.TextLine(title="ObjMaterialTxt", required=False)
    ObjObjectNumberTxt = schema.TextLine(title="ObjObjectNumberTxt", required=False)
    ObjTitleTxt = schema.TextLine(title="ObjTitleTxt", required=False)
    ObjPhysicalDescriptionTxt = schema.Text(
        title="ObjPhysicalDescriptionTxt", required=False
    )
    ObjCreditlineTxt = schema.TextLine(title="ObjCreditlineTxt", required=False)
    ObjTechniqueTxt = schema.TextLine(title="ObjTechniqueTxt", required=False)
    ObjCurrentLocationTxt = schema.TextLine(
        title="ObjCurrentLocationTxt", required=False
    )
    ObjCategoryTxt = schema.TextLine(title="ObjCategoryTxt", required=False)
    ObjObjectTypeTxt = schema.TextLine(title="ObjObjectTypeTxt", required=False)
    ObjDateFromTxt = schema.TextLine(title="ObjDateFromTxt", required=False)
    ObjDateToTxt = schema.TextLine(title="ObjDateToTxt", required=False)
    ObjDateNotesTxt = schema.TextLine(title="ObjDateNotesTxt", required=False)
    ObjAcquisitionMethodTxt = schema.TextLine(
        title="ObjAcquisitionMethodTxt", required=False
    )
    ObjAcquisitionDateTxt = schema.TextLine(
        title="ObjAcquisitionDateTxt", required=False
    )
    ObjHistoricLocationTxt = schema.TextLine(
        title="ObjHistoricLocationTxt", required=False
    )
    ObjPersonRole = schema.Dict(
        title="ObjPersonRole",
        key_type=schema.TextLine(title="Author Name"),  # define the type for the key
        value_type=schema.TextLine(
            title="Author Role"
        ),  # define the type for the value
        required=False,
    )
    rawdata = schema.Text(title="Rawdata", required=False)

    authors = RelationList(
        title="Authors",
        default=[],
        value_type=RelationChoice(
            title="Author", vocabulary="plone.app.vocabularies.Catalog"
        ),
        required=False,
    )
    form_directives.widget(
        "authors",
        RelatedItemsFieldWidget,
        pattern_options={
            "selectableTypes": [
                "author",
            ],
        },
    )

    lang_directives.languageindependent(
        "ObjDimensionTxt",
        "ObjMaterialTxt",
        "ObjObjectNumberTxt",
        "ObjTitleTxt",
        "ObjCreditlineTxt",
        "ObjTechniqueTxt",
        "ObjCurrentLocationTxt",
        "ObjCategoryTxt",
        "ObjObjectTypeTxt",
        "ObjDateFromTxt",
        "ObjDateToTxt",
        "ObjDateNotesTxt",
        # "ObjAcquisitionMethodTxt",
        "ObjAcquisitionDateTxt",
        "ObjHistoricLocationTxt",
        # "ObjPersonRef",
    )

    searchable(
        "ObjTitleTxt",
        "ObjObjectTypeTxt",
        "ObjMaterialTxt",
        "ObjObjectNumberTxt",
        "ObjTechniqueTxt",
        "ObjCreditlineTxt",
        "ObjDateFromTxt",
    )
