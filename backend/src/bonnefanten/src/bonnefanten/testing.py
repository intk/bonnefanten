from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing.zope import WSGI_SERVER_FIXTURE

import bonnefanten


class BONNEFANTENLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import collective.volto.formsupport
        import collective.volto.socialsettings
        import kitconcept.seo
        import plone.restapi
        import redturtle.voltoplugin.editablefooter

        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=kitconcept.seo)
        self.loadZCML(package=collective.volto.formsupport)
        self.loadZCML(package=redturtle.voltoplugin.editablefooter)
        self.loadZCML(package=collective.volto.socialsettings)
        self.loadZCML(package=bonnefanten)

    def setUpPloneSite(self, portal):
        applyProfile(portal, "bonnefanten:default")
        applyProfile(portal, "bonnefanten:initial")


BONNEFANTEN_FIXTURE = BONNEFANTENLayer()


BONNEFANTEN_INTEGRATION_TESTING = IntegrationTesting(
    bases=(BONNEFANTEN_FIXTURE,),
    name="BONNEFANTENLayer:IntegrationTesting",
)


BONNEFANTEN_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(BONNEFANTEN_FIXTURE, WSGI_SERVER_FIXTURE),
    name="BONNEFANTENLayer:FunctionalTesting",
)


BONNEFANTENACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        BONNEFANTEN_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        WSGI_SERVER_FIXTURE,
    ),
    name="BONNEFANTENLayer:AcceptanceTesting",
)
