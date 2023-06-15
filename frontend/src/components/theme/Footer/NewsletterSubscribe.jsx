import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  subscribe: {
    id: 'Subscribe',
    defaultMessage: 'Subscribe',
  },
});

const NewsletterSubscribe = ({ intl }) => (
  <div className="newsletter-subscribe">
    <a
      href="https://mailchi.mp/fdcc9a135efd/nieuwsbrief-haags-historisch-museum"
      target="_blank"
      rel="noopener noreferrer"
      className="newsletter-subscribe-link"
    >
      {intl.formatMessage(messages.subscribe)}
    </a>
  </div>
);

export default injectIntl(NewsletterSubscribe);
