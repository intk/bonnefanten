from bonnefanten.testing import BONNEFANTEN_INTEGRATION_TESTING
from pytest_plone import fixtures_factory


pytest_plugins = ["pytest_plone"]


globals().update(fixtures_factory(((BONNEFANTEN_INTEGRATION_TESTING, "integration"),)))
