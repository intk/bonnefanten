"""Init and utils."""
from zope.i18nmessageid import MessageFactory

import logging


PACKAGE_NAME = "bonnefanten"

_ = MessageFactory("bonnefanten")

logger = logging.getLogger("bonnefanten")

from .content.artwork import IArtwork
