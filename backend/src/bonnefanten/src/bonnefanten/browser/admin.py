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
from plone.dexterity.interfaces import IDexterityContent
from plone.folder.interfaces import IExplicitOrdering
from plone.namedfile.file import NamedBlobImage
from plone.protect.interfaces import IDisableCSRFProtection
from Products.Five.browser import BrowserView
from zc.relation.interfaces import ICatalog
from zope import component
from zope.component import getUtility
from zope.interface import alsoProvides
from zope.intid.interfaces import IIntIds
from zope.schema import getFields

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

    def translate(self, obj, fields):
        language = "en"

        manager = ITranslationManager(obj)

        # Check if translation in the target language already exists
        if manager.has_translation(language):
            trans = manager.get_translation(language)
        else:
            try:
                trans = translate(obj, language)
            except:
                new_id = str(uuid.uuid4())
                trans = translate(obj, language, id=new_id)
                log_to_file(f"gave the eng object new id")

        for k, v in fields.items():
            setattr(trans, k, v)

        for id, child in obj.contentItems():
            # TODO: use translator instead of copy
            content.copy(child, trans)

        if api.content.get_state(trans) == "private":
            content.transition(obj=trans, transition="publish")
        trans._p_changed = True

        # if obj.hasImage:
        #     trans.hasImage=True

        trans.reindexObject()

        return trans

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

        if not os.environ.get("DOCKER_DEPLOYMENT"):
            load_env_file(".env")

        API_USERNAME = os.environ.get("API_USERNAME")
        API_PASSWORD = os.environ.get("API_PASSWORD")

        credentials = f"{API_USERNAME}:{API_PASSWORD}".encode()
        encoded_credentials = base64.b64encode(credentials).decode("utf-8")

        headers = {
            "Content-Type": "application/xml",
            "Authorization": f"Basic {encoded_credentials}",
        }

        api_url = "https://de1.zetcom-group.de/MpWeb-mpMaastrichtBonnefanten/ria-ws/application/module/Object/export/61002/"

        # Get the directory of the current script
        current_directory = os.path.dirname(os.path.abspath(__file__))

        # Construct the path to the XML file
        xml_file_path = os.path.join(current_directory, "export-body.xml")

        with open(xml_file_path, "r") as xml_file:
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
                headers=headers,
            )

        return "all done"


def import_one_record(self, record, container, container_en, catalog, headers):
    # Convert <dc_record> element to XML string
    # dc_record_xml = ET.tostring(record, encoding='unicode')

    # print(dc_record_xml)
    # element = lxml.etree.fromstring(dc_record_xml)
    importedAuthors = import_authors(self, record)
    if importedAuthors:
        authors, authors_en = importedAuthors
    else:
        authors = "null"
        authors_en = "null"

    log_to_file(
        f"After calling import_authors: authors = {authors}, authors_en = {authors_en}"
    )

    record_text = json.dumps(record)
    info = {"nl": {}, "en": {}}
    intl = {"nl": {}, "en": {}}

    title = record["ObjTitleTxt"]
    info["nl"]["title"] = title
    info["en"]["title"] = title

    info["nl"]["rawdata"] = record_text
    info["en"]["rawdata"] = record_text

    info["nl"]["ObjAcquisitionMethodTxt"] = record["ObjAcquisitionMethodTxt"][
        "LabelTxt_nl"
    ]
    info["en"]["ObjAcquisitionMethodTxt"] = record["ObjAcquisitionMethodTxt"][
        "LabelTxt_en"
    ]

    info["nl"]["ObjAcquisitionDateTxt"] = record["ObjAcquisitionDateTxt"]
    info["en"]["ObjAcquisitionDateTxt"] = record["ObjAcquisitionDateTxt"]

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
        "ObjHistoricLocationTxt": "ObjHistoricLocationTxt",
    }

    if "ObjPersonRef" in record and "Items" in record["ObjPersonRef"]:
        # Loop through each author in the record
        roles_dict = {}  # Dictionary to store the name and role pairs
        roles_dict_en = {}
        for item in record["ObjPersonRef"]["Items"]:
            authorName = item["LinkLabelTxt"]
            authorRole = item["RoleTxt"]["LabelTxt_nl"]
            authorRole_en = item["RoleTxt"]["LabelTxt_en"]
            roles_dict[authorName] = authorRole
            roles_dict_en[authorName] = authorRole_en
        info["en"]["ObjPersonRole"] = roles_dict
        info["nl"]["ObjPersonRole"] = roles_dict_en

    for xml_field, info_field in fields_to_extract.items():
        value = record[xml_field]
        info["nl"][info_field] = value if value else ""
        info["en"][info_field] = value if value else ""

    extra_large_uri = None
    thumbnails = record.get("Thumbnails", [])

    if (
        thumbnails
        and isinstance(thumbnails, list)
        and "Sizes" in thumbnails[0]
        and "ExtraLargeUri" in thumbnails[0]["Sizes"]
    ):
        info["nl"]["images"] = record["Thumbnails"][0]["Sizes"]["ExtraLargeUri"]
        info["en"]["images"] = record["Thumbnails"][0]["Sizes"]["ExtraLargeUri"]
        print(info["nl"]["images"])
    else:
        info["en"]["images"] = "null"

    # Find the existing object
    ObjectNumber = info["nl"]["ObjObjectNumberTxt"]

    # Check if only one language version of the object with ObjectNumber exists
    brains = catalog.searchResults(
        ObjObjectNumberTxt=ObjectNumber, portal_type="artwork"
    )
    if len(brains) == 1:
        lang = brains[0].getObject().language
        missing_lang = "en" if lang == "nl" else "nl"
        if missing_lang == "nl":
            obj = create_and_setup_object(
                title, container, info, intl, "artwork"
            )  # Dutch version
            # log_to_file(f"{ObjectNumber} Dutch version of object is created")

            if authors != "null":
                for author in authors:
                    relation.create(source=obj, target=author, relationship="authors")

            manager = ITranslationManager(obj)
            if not manager.has_translation("en"):
                manager.register_translation("en", brains[0].getObject())

            # adding images
            if info["en"]["images"]:
                import_images(
                    container=obj, image=info["en"]["images"], headers=headers
                )
                obj.hasImage = True
            obj.reindexObject()

        else:
            obj_en = create_and_setup_object(
                title, container_en, info, intl, "artwork"
            )  # English version
            # log_to_file(f"{ObjectNumber} English version of object is created")
            if authors_en != "null":
                for author in authors_en:
                    relation.create(
                        source=obj_en, target=author, relationship="authors"
                    )

            manager = ITranslationManager(obj_en)
            if not manager.has_translation("nl"):
                manager.register_translation("nl", brains[0].getObject())

            # adding images
            if info["en"]["images"]:
                import_images(
                    container=obj_en, image=info["en"]["images"], headers=headers
                )
                obj_en.hasImage = True

            obj_en.reindexObject()

    # # Check if object with ObjectNumber already exists in the container
    elif brains:
        for brain in brains:
            # Object exists, so we fetch it and update it
            obj = brain.getObject()

            # First clear all of the fields
            schema = obj.getTypeInfo().lookupSchema()
            fields = getFields(schema)

            # Exclude these fields from clearing
            exclude_fields = ["id", "UID", "title", "description", "authors"]

            for field_name, field in fields.items():
                if field_name not in exclude_fields:
                    # Clear the field by setting it to its missing_value
                    setattr(obj, field_name, field.missing_value)

            # Update the object's fields with new data
            lang = obj.language
            for k, v in info[lang].items():
                if v:
                    setattr(obj, k, v)

            for k, v in intl[lang].items():
                if v:
                    setattr(obj, k, json.dumps(v))

            if lang == "nl":
                if authors != "null":
                    log_to_file(f"authors {authors}")
                    for author in authors:
                        log_to_file(f"author {author}")
                        relation.delete(
                            source=obj, target=author, relationship="authors"
                        )
                        relation.create(
                            source=obj, target=author, relationship="authors"
                        )

            else:
                if authors != "null":
                    for author_en in authors_en:
                        relation.delete(
                            source=obj, target=author_en, relationship="authors"
                        )
                        relation.create(
                            source=obj, target=author_en, relationship="authors"
                        )

            log_to_file(f"{ObjectNumber} object is updated")

            # adding images
            if info["en"]["images"] != "null":
                import_images(
                    container=obj, image=info["en"]["images"], headers=headers
                )
                obj.hasImage = True

            # Reindex the updated object
            obj.reindexObject()

    # # Object doesn't exist, so we create a new one
    else:
        if not title:
            title = "Untitled Object"  # default value for untitled objects

        obj = create_and_setup_object(
            title, container, info, intl, "artwork"
        )  # Dutch version

        # log_to_file(f"{ObjObjectNumberTxt} object is created")

        # adding images
        if info["en"]["images"] != "null":
            import_images(container=obj, image=info["en"]["images"], headers=headers)
            obj.hasImage = True

        obj_en = self.translate(obj, info["en"])

        if authors != "null":
            for author in authors:
                relation.create(source=obj, target=author, relationship="authors")
            for author_en in authors_en:
                relation.create(source=obj_en, target=author_en, relationship="authors")


def create_and_setup_object(title, container, info, intl, object_type):
    """
    Create an object with the given title and container, then set its attributes
    using the provided info and intl dictionaries.
    """
    urlTitle = title.replace(" ", "-")
    obj_id = f"{info['nl']['ObjObjectNumberTxt']}-{urlTitle}"
    try:
        obj = api.content.create(
            type=object_type,
            id=obj_id,
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
    obj.reindexObject()

    return obj


def import_images(container, image, headers):
    MAX_RETRIES = 2
    DELAY_SECONDS = 1

    # Extract the API authentication from the headers (if available)
    API_USERNAME = os.environ.get("API_USERNAME")
    API_PASSWORD = os.environ.get("API_PASSWORD")

    credentials = f"{API_USERNAME}:{API_PASSWORD}".encode()
    encoded_credentials = base64.b64encode(credentials).decode("utf-8")
    headers = {
        "Content-Type": "application/xml",
        "Authorization": f"Basic {encoded_credentials}",
    }

    # Delete the existing images inside the container
    for obj in api.content.find(context=container, portal_type="Image"):
        api.content.delete(obj=obj.getObject())

    retries = 0
    success = False
    imageTitle = image

    # Tries MAX_RETRIES times and then raise exception
    while retries < MAX_RETRIES:
        try:
            image_url = (
                f"https://de1.zetcom-group.de/MpWeb-mpMaastrichtBonnefanten{image}"
            )
            with requests.get(
                url=image_url, stream=True, verify=False, headers=headers
            ) as req:  # noqa
                req.raise_for_status()
                data = req.raw.read()

                if "DOCTYP" in str(data[:10]):
                    continue

                log_to_file(f"{image} image is created")

                imagefield = NamedBlobImage(
                    data=data,
                    contentType="image/jpeg",
                    filename=f"{image}.jpeg",
                )
                created_image = api.content.create(
                    type="Image",
                    title="test",
                    image=imagefield,
                    container=container,
                )

                success = True
                break

        except requests.RequestException as e:
            retries += 1
            if retries < MAX_RETRIES:
                time.sleep(DELAY_SECONDS)
            else:
                log_to_file(f"failed to create {image} image")

    if not success:
        log_to_file(f"Skipped image {image} due to repeated fetch failures.")

    return f"Image {image} created successfully"


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


def import_authors(self, record, use_archive=True):
    container = get_base_folder(self.context, "author")
    container_en = get_base_folder(self.context, "author_en")
    authors = []
    authors_en = []

    if "ObjPersonRef" in record and "Items" in record["ObjPersonRef"]:
        # Loop through each author in the record
        for item in record["ObjPersonRef"]["Items"]:
            if "ReferencedId" in item:
                authorID = item["ReferencedId"]

                found = content.find(
                    portal_type="author",
                    authorID=authorID,
                    Language="nl",
                )
                found_en = content.find(
                    portal_type="author",
                    authorID=authorID,
                    Language="en",
                )
                if found:
                    for brain in found:
                        authors.append(brain.getObject())

                    for brain in found_en:
                        authors_en.append(brain.getObject())
                    continue  # If found, skip creating a new author

                authorName = item["LinkLabelTxt"]

                author = content.create(
                    type="author",
                    container=container,
                    title=authorName,
                    authorID=authorID,
                )
                author_en = content.create(
                    type="author",
                    container=container_en,
                    title=authorName,
                    authorID=authorID,
                )  # English version

                manager = ITranslationManager(author)
                if not manager.has_translation("en"):
                    manager.register_translation("en", author_en)

                authors.append(author)
                authors_en.append(author_en)
                content.transition(obj=author, transition="publish")
                content.transition(obj=author_en, transition="publish")

                log_to_file(f"Created author {author.getId()}")

    return [authors, authors_en]
