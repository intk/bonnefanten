from bonnefanten.config import DATA_REPO
from bonnefanten.config import IMAGE_BASE_URL
from bonnefanten.config import IMPORT_LOCATIONS
from collections import defaultdict
from datetime import datetime
from DateTime import DateTime
from plone import api
from plone.api import content
from plone.api import portal
from plone.api import relation
from plone.app.multilingual.api import get_translation_manager
from plone.app.multilingual.api import translate
from plone.app.multilingual.interfaces import ITranslationManager
from plone.folder.interfaces import IExplicitOrdering
from plone.namedfile.file import NamedBlobImage
from plone.protect.interfaces import IDisableCSRFProtection
from Products.Five.browser import BrowserView
from zc.relation.interfaces import ICatalog
from zope import component
from zope.component import getUtility
from zope.interface import alsoProvides
from zope.intid.interfaces import IIntIds

import base64
import json
import logging
import lxml.etree
import os
import requests
import time
import transaction
import uuid
import xml.etree.ElementTree as ET


class AdminFixes(BrowserView):
    def __call__(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        op = self.request.form.get("op")

        return getattr(self, op)()

    def import_objects(self):
        start_range = self.request.form.get("start_range", 0)
        end_range = self.request.form.get("end_range", 3000)

        counter = 0

        start_time = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )  # Record the start time
        today_date = datetime.now().strftime("%d-%m-%y")
        date_from = self.request.form.get("date_from")

        log_to_file(f"========================")
        log_to_file(f"========================")
        log_to_file(
            f"The sync function started at {start_time} for the range of objects between {start_range} and {end_range} "
        )

        if not os.environ.get('DOCKER_DEPLOYMENT'):
            load_env_file('.env')

        API_USERNAME = os.environ.get("API_USERNAME")
        API_PASSWORD = os.environ.get("API_PASSWORD")

        credentials = f"{API_USERNAME}:{API_PASSWORD}".encode()
        encoded_credentials = base64.b64encode(credentials).decode("utf-8")

        headers = {
            "Content-Type": "application/xml",
            "Authorization": f"Basic {encoded_credentials}",
        }

        api_url = "https://de1.zetcom-group.de/MpWeb-mpMaastrichtBonnefanten/ria-ws/application/module/Object/export/61002/"

        with open(
            "src/bonnefanten/src/bonnefanten/browser/export-body.xml", "r"
        ) as xml_file:
            xml_content = xml_file.read()

        response = requests.post(api_url, data=xml_content, headers=headers)
        response.raise_for_status()
        api_answer = response.text

        container = get_base_folder(self.context, "artwork")
        container_en = get_base_folder(self.context, "artwork_en")
        site = api.portal.get()
        catalog = site.portal_catalog

        records = json.loads(api_answer)
        for record in records:

            import_one_record(
                self,
                record=record,
                container=container,
                container_en=container_en,
                catalog=catalog,
            )

        return "all done"


def import_one_record(self, record, container, container_en, catalog):
    # Convert <dc_record> element to XML string
    # dc_record_xml = ET.tostring(record, encoding='unicode')

    # print(dc_record_xml)
    # element = lxml.etree.fromstring(dc_record_xml)
    # authors, authors_en = import_authors(self, element)

    record_text = json.dumps(record)
    info = {"nl": {}, "en": {}}
    intl = {"nl": {}, "en": {}}

    title = record["ObjTitleTxt"]
    info["nl"]["title"] = title
    info["en"]["title"] = title

    info["nl"]["rawdata"] = record_text
    info["en"]["rawdata"] = record_text

    fields_to_extract = {
        "ObjObjectNumberTxt": "ObjObjectNumberTxt",
        "ObjTitleTxt": "ObjTitleTxt",
        "ObjDimensionTxt": "ObjDimensionTxt",
        "ObjMaterialTxt": "ObjMaterialTxt",
        "ObjTitleTxt": "ObjTitleTxt",
        "ObjPhysicalDescriptionTxt": "ObjPhysicalDescriptionTxt",
        "ObjCreditlineTxt": "ObjCreditlineTxt",
        "ObjTechniqueTxt": "ObjTechniqueTxt",
        "ObjCurrentLocationTxt": "ObjCurrentLocationTxt",
        "ObjCategoryTxt": "ObjCategoryTxt",
        "ObjObjectTypeTxt": "ObjObjectTypeTxt",
        "ObjDateFromTxt": "ObjDateFromTxt",
        "ObjDateToTxt": "ObjDateToTxt",
        "ObjDateNotesTxt": "ObjDateNotesTxt",
        # "ObjAcquisitionMethodTxt" : "ObjAcquisitionMethodTxt",
        # "ObjAcquisitionDateTxt" : "ObjAcquisitionDateTxt",
        "ObjHistoricLocationTxt": "ObjHistoricLocationTxt",
        # "ObjPersonRef" : "ObjPersonRef",
    }

    for xml_field, info_field in fields_to_extract.items():
        value = record[xml_field]
        info["nl"][info_field] = value if value else ""
        info["en"][info_field] = value if value else ""

    # ObjObjectNumberTxt = record["ObjObjectNumberTxt"]
    # info['nl']['ObjObjectNumberTxt'] = ObjObjectNumberTxt
    # info['en']['ObjObjectNumberTxt'] = ObjObjectNumberTxt

    # title = record["ObjTitleTxt"]
    # info['nl']['title'] = title
    # info['en']['title'] = title

    language_dependent_fields = {
        # "objectClassification" : "objectClassification",
        # "objectMedium": "objectMedium",
    }

    # for lang in info.keys():
    #     for xml_field, info_field in language_dependent_fields.items():
    #         value = element.xpath(f"//dc_record/{xml_field}[@Language='{lang.upper()}']")
    #         if value:
    #             info[lang][info_field] = value[0].text
    #         else:
    #             info[lang][info_field] = ''

    # for xml_field, info_field in fields_to_extract.items():
    #     elements = element.xpath(f"//dc_record/{xml_field}")
    #     info['nl'][info_field] = elements[0].text if elements else ''
    #     info['en'][info_field] = elements[0].text if elements else ''

    # rawdata = element.xpath("//dc_record")[0]
    # info['nl']['rawdata'] = lxml.etree.tostring(rawdata)
    # info['en']['rawdata'] = lxml.etree.tostring(rawdata)

    # titles = element.xpath("//dc_record/objectTitle")
    # title = titles[0].text
    # if len(titles) > 1:
    #     titles.sort(key=lambda x: x.get("Rangorde") or "")
    #     title = titles[0].text
    # info['nl']['objectTitle'] = title
    # info['en']['objectTitle'] = title

    # attrs = [
    # "objectPosition",
    # "objectFormatWidth",
    # "objectFormatDepth",
    # "objectFormatLength",
    # "objectKeys",
    # "authorID"
    # ]

    # for attr in attrs:
    #     value = element.xpath(f"//dc_record/{attr}")
    #     if value:
    #         info['en'][attr] = str(value[0].text)
    #         info['nl'][attr] = str(value[0].text)

    #         # If the current attribute is 'objectPosition' and the value is not empty
    #         if attr == "objectPosition" and str(value[0]).strip():
    #             info['en']['objectOnDisplay'] = True
    #             info['nl']['objectOnDisplay'] = True

    # for field in ["ObjectAudio", "ObjectVideo"]:
    #     for lang in info.keys():
    #         els = element.xpath(
    #             f"//dc_record/{field}[@Language='{lang.upper()}']")
    #         if not els:
    #             continue
    #         info[lang][field] = [
    #             {"title": (el.get("Title") or "").strip(),
    #                 "filename": (el.text or "").strip()}
    #             for el in els
    #         ]

    # for lang in info.keys():
    #     objectDescription = element.xpath(f"//dc_record/objectDescription[@Language='{lang.upper()}']")
    #     if len(objectDescription)>1:
    #         for e in objectDescription:
    #             descTitle=e.get('Title')
    #             descScope=e.get('Scope')
    #             if descTitle or descScope:
    #                 info[lang]['objectDescription_extra'] = str(e.text)
    #                 info[lang]['objectDescription_extra_title'] = descTitle
    #                 info[lang]['objectDescription_extra_scope'] = descScope
    #             else:
    #                 info[lang]['objectDescription'] = e.text
    #     elif objectDescription:
    #         info[lang]['objectDescription'] = objectDescription[0].text
    #     else:
    #         info[lang]['objectDescription'] = ''

    # Find the existing object
    # brains = catalog.searchResults(ccObjectID=ccObjectID, portal_type="artwork")

    # Check if only one language version of the object with ccObjectID exists
    # brains = catalog.searchResults(ccObjectID=ObjObjectNumberTxt)
    # if len(brains)==1:
    #     lang = brains[0].getObject().language
    #     missing_lang = 'en' if lang == 'nl' else 'nl'
    #     if missing_lang == 'nl':
    #         obj = create_and_setup_object(title, container, info, intl, "artwork") #Dutch version
    #         log_to_file(f"{ccObjectID} Dutch version of object is created")
    #         # for author in authors:
    #             # relation.create(source=obj, target=author, relationship="authors")

    #         manager = ITranslationManager(obj)
    #         if not manager.has_translation('en'):
    #             manager.register_translation('en', brains[0].getObject())

    #         #adding images
    #         images=element.xpath(f"//dc_record/objectImage")
    #         if images:
    #             import_images(
    #                 container= obj,
    #                 images=images
    #                 )
    #             obj.hasImage=True;
    #         obj.reindexObject()

    #     else:
    #         obj_en = create_and_setup_object(title, container_en, info, intl, "artwork") #English version
    #         log_to_file(f"{ccObjectID} English version of object is created")
    #         # for author_en in authors_en:
    #             # relation.create(source=obj_en, target=author_en, relationship="authors")

    #         manager = ITranslationManager(obj_en)
    #         if not manager.has_translation('nl'):
    #             manager.register_translation('nl', brains[0].getObject())

    #         #adding images
    #         images=element.xpath(f"//dc_record/objectImage")
    #         if images:
    #             import_images(
    #                 container= obj_en,
    #                 images=images
    #                 )
    #             obj_en.hasImage=True;
    #         obj_en.reindexObject()

    # # Check if object with ccObjectID already exists in the container
    # # brains = catalog.searchResults(ccObjectID=ccObjectID)
    # elif brains:
    #     for brain in brains:
    #         # Object exists, so we fetch it and update it
    #         obj = brain.getObject()

    #         # Update the object's fields with new data
    #         lang = obj.language
    #         for k, v in info[lang].items():
    #             if v:
    #                 setattr(obj, k, v)

    #         for k, v in intl[lang].items():
    #             if v:
    #                 setattr(obj, k, json.dumps(v))

    #         # print(f"Updated Object ID: {obj.getId()}, Path: {obj.absolute_url()}, Workflow State: {api.content.get_state(obj)}")

    #         # if lang == "nl":
    #         #     for author in authors:
    #         #         relation.delete(source=obj, target=author, relationship="authors")
    #         #         relation.create(source=obj, target=author, relationship="authors")

    #         # else:
    #         #     for author_en in authors_en:
    #         #         relation.delete(source=obj, target=author_en, relationship="authors")
    #         #         relation.create(source=obj, target=author_en, relationship="authors")

    #         log_to_file(f"{ccObjectID} object is updated")

    #         #adding images
    #         images=element.xpath(f"//dc_record/objectImage")
    #         if images:
    #             import_images(
    #                 container= obj,
    #                 images=images
    #                 )
    #         obj.hasImage=True;

    #         # Reindex the updated object
    #         obj.reindexObject()

    # # Object doesn't exist, so we create a new one
    if True:
        if not title:
            title = "Untitled Object"  # default value for untitled objects

        obj = create_and_setup_object(
            title, container, info, intl, "artwork"
        )  # Dutch version
        # obj_en = create_and_setup_object(title, container_en, info, intl) #English version
        # obj_en = self.translate(obj, info['en'])

        # log_to_file(f"{ObjObjectNumberTxt} object is created")

        # for author in authors:
        #     relation.create(source=obj, target=author, relationship="authors")
        # for author_en in authors_en:
        #     relation.create(source=obj_en, target=author_en, relationship="authors")

        # adding images
        # images=element.xpath(f"//dc_record/objectImage")
        # if images:
        #     import_images(
        #         container= obj,
        #         images=images
        #         )
        #     obj.hasImage=True;

        # obj_en = self.translate(obj, info['en'])


def create_and_setup_object(title, container, info, intl, object_type):
    """
    Create an object with the given title and container, then set its attributes
    using the provided info and intl dictionaries.
    """
    try:
        obj = api.content.create(
            type=object_type,
            title=title,
            container=container,
        )
    except TypeError as e:
        log_to_file(
            f"Error while creating the Object {title}, -> info {info} -> error {e}"
        )
        raise e

    lang = obj.language
    for k, v in info[lang].items():
        if v:
            setattr(obj, k, v)

    for k, v in intl[lang].items():
        if v:
            setattr(obj, k, json.dumps(v))

    # Publish the object if it's private
    if api.content.get_state(obj) == "private":
        content.transition(obj=obj, transition="publish")

    # Reindex the object
    # obj.reindexObject(idxs=['objectTitle', 'Title', 'sortable_title', 'ccObjectID'])
    obj.reindexObject()

    return obj


def import_images(container, images):
    MAX_RETRIES = 2
    DELAY_SECONDS = 1

    # Delete the existing images inside the container
    for obj in api.content.find(context=container, portal_type="Image"):
        api.content.delete(obj=obj.getObject())

    for image in images:
        primaryDisplay = image.get("PrimaryDisplay")
        retries = 0
        success = False

        # Tries MAX_RETRIES times and then raise exception
        while retries < MAX_RETRIES:
            try:
                with requests.get(
                    url=f"{IMAGE_BASE_URL}/{image.text}",
                    stream=True,
                    verify=False,
                    headers=HEADERS,
                ) as req:  # noqa
                    req.raise_for_status()
                    data = req.raw.read()

                    if "DOCTYP" in str(data[:10]):
                        continue

                    log_to_file(f"{image.text} image is created")

                    imagefield = NamedBlobImage(
                        # TODO: are all images jpegs?
                        data=data,
                        contentType="image/jpeg",
                        filename=image.text,
                    )
                    image = api.content.create(
                        type="Image",
                        title=image.text,
                        image=imagefield,
                        container=container,
                    )

                    if primaryDisplay == "1":
                        ordering = IExplicitOrdering(container)
                        ordering.moveObjectsToTop([image.getId()])

                    success = True
                    break

            except requests.RequestException as e:
                retries += 1
                if retries < MAX_RETRIES:
                    time.sleep(DELAY_SECONDS)
                else:
                    # print(
                    #     f"Failed to fetch image {image.text} after {MAX_RETRIES} attempts: {e}"
                    # )
                    log_to_file(f"failed to create {image.text} image")

        if not success:
            log_to_file(f"Skipped image {image.text} due to repeated fetch failures.")

    return f"Images {images} created successfully"


def log_to_file(message):
    # log_file_path = "/app/logs/collectionLogs.txt"
    log_file_path = "/Users/cihanandac/Documents/bonnefanten/collectionLogs.txt"

    # Attempt to create the file if it doesn't exist
    try:
        if not os.path.exists(log_file_path):
            with open(log_file_path, "w") as f:
                pass
    except Exception as e:
        return f"Error creating log file: {e}"

    # Append the log message to the file
    try:
        with open(log_file_path, "a") as f:
            f.write(message + "\n")
    except Exception as e:
        return f"Error writing to log file: {e}"


def get_base_folder(context, portal_type):
    base = portal.get()
    return base.restrictedTraverse(IMPORT_LOCATIONS[portal_type])


def load_env_file(env_file_path):
    with open(env_file_path, "r") as f:
        for line in f:
            name, value = line.strip().split("=", 1)
            os.environ[name] = value
