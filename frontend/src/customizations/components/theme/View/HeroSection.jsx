import React from 'react';
// import { Container } from 'semantic-ui-react';
import { BodyClass } from '@plone/volto/helpers';
import Image from '@package/components/theme/Image/Image';
import { useIntl } from 'react-intl';

const getDateRangeDescription = (lang, start, end) => {
  if (
    !end ||
    (start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear() &&
      start.getDate() === end.getDate())
  ) {
    return new Intl.DateTimeFormat(lang, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(start);
  }

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${new Intl.DateTimeFormat(lang, {
      day: 'numeric',
    }).format(start)} ${lang === 'nl' ? 't/m' : 'to'} ${new Intl.DateTimeFormat(
      lang,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    ).format(end)}`;
  }

  return `${new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'short',
  }).format(start)} ${lang === 'nl' ? 't/m' : 'to'} ${new Intl.DateTimeFormat(
    lang,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(end)}`;
};

function HeroSection(props) {
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const { image_url, content } = props;
  // eslint-disable-next-line no-unused-vars
  const { title, preview_caption, has_hero_section, start, end } =
    content || {};

  const isEvent = content?.['@type'] === 'Event';

  const endDate = new Date(end || Date.now());
  const startDate = new Date(start || Date.now());

  // const isCurrentEvent = startDate <= Date.now() && endDate >= Date.now();
  // const isFutureEvent = startDate > Date.now();

  return (
    <div className="herosection">
      <BodyClass className="has-hero-image" />
      <div className="herosection-content-wrapper">
        {content?.preview_image ? (
          <>
            <BodyClass className="has-hero-image" />
            <figure className="herosection-content-image document-image">
              <Image
                image={content.preview_image}
                width="100vw"
                height="auto"
                alt={preview_caption}
                title={preview_caption}
              />
            </figure>
            <div className="header-title-dates">
              <div className="header-quotes-wrapper">
                <div className="quote-top-left quote-bonnefanten">“</div>
                <div className="quote-top-right quote-bonnefanten">”</div>
              </div>
              <h1 className="hero-title-floating">
                {preview_caption || title}
              </h1>
              {startDate && isEvent && (
                <p className="hero-dates">
                  {getDateRangeDescription(intl.locale, startDate, endDate)}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="herosection-missing-image"></div>
        )}
      </div>
      <div id="hero-section-anchor"></div>
    </div>
  );
}

export default HeroSection;
