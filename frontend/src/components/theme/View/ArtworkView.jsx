// http://localhost:8080/Plone/nl/archief/@@import_vubis?import=artwork&max=10&query=authorName=Douglas%20Gordon
// import { RenderBlocks } from '@plone/volto/components';
import React, { useState, useRef } from 'react';
// import { FormattedMessage } from 'react-intl';
import { Container } from 'semantic-ui-react';
// import { Card } from '@package/components'; // SocialLinks,
// import ImageAlbum from '../ImageAlbum/ImageAlbum';
// import config from '@plone/volto/registry';
// import { useSiteDataContent } from '@package/helpers';
// import { LuFileVideo, LuFileAudio } from 'react-icons/lu';
// import { injectIntl } from 'react-intl';
import './css/artworkview.less';
import ReactSwipe from 'react-swipe';
// import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { SlMagnifierAdd, SlMagnifierRemove } from 'react-icons/sl';
import { GoShare } from 'react-icons/go';
// import { GoDownload } from 'react-icons/go';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import fbbutton from './assets/soc_fb_wBG.svg';
import twbutton from './assets/share_button_twitter.svg';
import { defineMessages, useIntl } from 'react-intl';
import { SeeMore } from '../../index';

const messages = defineMessages({
  artist: {
    id: 'artist',
    defaultMessage: 'Vervaardiger',
  },
  title: {
    id: 'title',
    defaultMessage: 'Titel',
  },
  objectCategory: {
    id: 'objectCategory',
    defaultMessage: 'Objectcategorie',
  },
  objectType: {
    id: 'objectType',
    defaultMessage: 'Objectnaam',
  },
  date: {
    id: 'date',
    defaultMessage: 'Datering',
  },
  material: {
    id: 'material',
    defaultMessage: 'Materialen',
  },
  technique: {
    id: 'technique',
    defaultMessage: 'Techniek',
  },
  acquisition: {
    id: 'acquisition',
    defaultMessage: 'Verwerving',
  },
  dimension: {
    id: 'dimension',
    defaultMessage: 'Afmetingen',
  },
  description: {
    id: 'description',
    defaultMessage: 'Fysieke beschrijving',
  },
  credit: {
    id: 'credit',
    defaultMessage: 'Credit line',
  },
  objectNumber: {
    id: 'objectNumber',
    defaultMessage: 'Objectnummer',
  },
  question: {
    id: 'question',
    defaultMessage: 'Vragen?',
  },
  questionText: {
    id: 'questionText',
    defaultMessage:
      'Ziet u een fout? Of heeft u extra informatie over dit object? ',
  },
  share: {
    id: 'share',
    defaultMessage: 'Delen',
  },
  details: {
    id: 'details',
    defaultMessage: 'Objectgegevens',
  },
  nowonview: {
    id: 'nowonview',
    defaultMessage: 'Nu te zien',
  },
});

export default function ArtworkView(props) {
  const intl = useIntl();
  const { content } = props;

  // eslint-disable-next-line no-unused-vars
  let reactSwipeEl;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataExpand, setDataExpand] = useState(false);
  // const currentImageUrl = props.content?.items[currentIndex]?.url;
  // const downloadLink = `${currentImageUrl}/@@images/image`;

  const [popupVisible, setPopupVisible] = useState(false);
  const zoomUtilsRefs = useRef([]);

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };
  const closePopup = () => {
    setPopupVisible(false);
  };

  // const authors = content.authors.map((auth) => auth.title).join(', ');
  // const linkAuthors = content.authors || contextLinks?.authors;
  const linkAuthors = content.authors;

  const expandData = () => {
    setDataExpand(!dataExpand);
    const sliderElement = document.getElementById('swipe-slider');
    const rawDataElement = document.getElementById('rawdata');
    const viewportHeight = window.innerHeight;

    if (dataExpand === false && sliderElement) {
      const topPosition = rawDataElement.offsetTop - viewportHeight / 7;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    } else if (dataExpand === true && rawDataElement) {
      const topPosition = sliderElement.offsetTop - viewportHeight / 4;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  const materials = content.ObjMaterialTxt.split(',');
  const materialsArray = materials.map((material, index) =>
    index !== materials.length - 1 ? material + ',' : material.trim(),
  );

  // Buttons for the image and text
  const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
    <>
      <button
        className={dataExpand ? 'button expand expanded' : 'button expand'}
        onClick={expandData}
      >
        {dataExpand === true
          ? `− ${intl.formatMessage(messages.details)}`
          : `+ ${intl.formatMessage(messages.details)}`}
      </button>
      <button
        className="button share"
        onClick={togglePopup}
        onMouseLeave={closePopup}
      >
        <GoShare
          icon
          className="Sharebutton"
          aria-label="share button"
          height="2em"
        />
        {popupVisible && (
          <div className="social-media-popup" role="tooltip" id="popover825468">
            <h3 className="popover-title">
              {intl.formatMessage(messages.share)}
            </h3>
            <div className="popover-content">
              <div className="row facebook-row">
                <a
                  onclick="return !window.open(this.href, 'Facebook', 'width=500,height=500')"
                  className="share-btn-social"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                >
                  <img
                    className="share-button"
                    alt="Delen op Facebook"
                    src={fbbutton}
                  />
                </a>
              </div>

              <div className="row twitter-row">
                <a
                  onclick="return !window.open(this.href, 'Twitter', 'width=500,height=500')"
                  className="share-btn-social"
                  href={`http://twitter.com/share?text=${''}&url=${
                    window.location.href
                  }`}
                >
                  <img
                    className="share-button"
                    alt="Delen op Twitter"
                    src={twbutton}
                  />
                </a>
              </div>

              <div className="row pinterest-row">
                <a
                  id="pinterest-btn"
                  href={`http://www.pinterest.com/pin/create/button/?url=${window.location.href}`}
                  data-pin-do="buttonPin"
                  data-pin-config="none"
                >
                  <img
                    alt="Delen op Pinterest"
                    src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_gray_20.png"
                    href={`http://www.pinterest.com/pin/create/button/?url=${window.location.href}`}
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </button>
      {/* <a
        className="button"
        href={downloadLink}
        role="button"
        aria-label="download button"
        download
      >
        <GoDownload
          icon
          className="Downloadbutton"
          aria-label="download button"
          height="2em"
        />
      </a> */}
      <button
        className="button zoomplus"
        onClick={() => zoomUtilsRefs.current[currentIndex]?.zoomIn()}
      >
        <SlMagnifierAdd
          icon
          className="MagnifierPlus"
          aria-label="magnifier plus"
          height="2em"
        />
      </button>

      <button className="button zoomminus" onClick={() => zoomOut()}>
        <SlMagnifierRemove
          icon
          className="MagnifierPlus"
          aria-label="magnifier plus"
          height="2em"
        />
      </button>
    </>
  );

  return (
    <div id="object-block">
      <Container>
        <div className="object-wrapper full-width">
          <div id="swipe-slider">
            <ReactSwipe
              className="carousel"
              swipeOptions={{
                continuous: true,
                transitionEnd: (index) => {
                  setCurrentIndex(index);
                },
              }}
              ref={(el) => (reactSwipeEl = el)}
            >
              {props.content?.items.map((item, index) => {
                if (item['@type'] === 'Image') {
                  return (
                    <div className="zoom-container">
                      <TransformWrapper
                        initialScale={1}
                        key={index}
                        minScale={0.5}
                        maxScale={3}
                        wheel={{
                          activationKeys: ['Control', 'Shift'],
                        }}
                      >
                        {(utils) => {
                          zoomUtilsRefs.current[index] = utils;
                          return (
                            <React.Fragment>
                              <TransformComponent>
                                <img
                                  src={`${item.url}/@@images/image`}
                                  id="imgExample"
                                  alt="test"
                                />
                              </TransformComponent>
                            </React.Fragment>
                          );
                        }}
                      </TransformWrapper>
                    </div>
                  );
                }
                return null;
              })}
            </ReactSwipe>
            {/* <div className="leftrightbuttons">
                          <button
                            onClick={() => {
                              reactSwipeEl.prev();
                            }}
                          >
                            <BsArrowLeft
                              icon
                              className="leftarrow"
                              aria-label="left arrow"
                            ></BsArrowLeft>
                          </button>
                          <span className="paginator">
                            <p>{`${currentIndex + 1}/${
                              props.content?.items_total
                            }`}</p>
                          </span>{' '}
                          <button
                            onClick={() => {
                              reactSwipeEl.next();
                            }}
                          >
                            <BsArrowRight
                              icon
                              className="rightarrow"
                              aria-label="right arrow"
                              height="2em"
                            ></BsArrowRight>
                          </button>
                        </div> */}
            <div className="buttons">
              <Controls {...zoomUtilsRefs.current[currentIndex]} />
            </div>
          </div>
          <div
            id="rawdata"
            className={`rawdata-section ${dataExpand ? 'expanded' : ''}`}
          >
            <table>
              <tbody>
                {
                  <tr>
                    <td className="columnone">
                      <p></p>
                    </td>
                    <td className="columntwo">
                      <p>{intl.formatMessage(messages.nowonview)}</p>
                    </td>
                  </tr>
                }
                {linkAuthors.length !== 0 ? (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.artist)}</p>
                    </td>
                    <td className="columntwo">
                      {linkAuthors?.map((auth, index) => (
                        <p key={index}>
                          <a href={auth['@id']}>{auth.title}</a>
                          <span>
                            <a
                              href={`/search?SearchableText=${
                                content.ObjPersonRole[auth.title]
                              }`}
                            >
                              {' '}
                              ({content.ObjPersonRole[auth.title]})
                            </a>
                          </span>
                        </p>
                      ))}
                    </td>
                  </tr>
                ) : (
                  ''
                )}
                {content.title && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.title)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.title}</p>
                    </td>
                  </tr>
                )}
                {content.ObjCategoryTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.objectCategory)}</p>
                    </td>
                    <td className="columntwo">
                      <p>
                        {/* <a
                          href={`/search?SearchableText=${content.ObjCategoryTxt}`}
                        > */}
                        {content.ObjCategoryTxt}
                        {/* </a> */}
                      </p>
                    </td>
                  </tr>
                )}
                {content.ObjObjectTypeTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.objectType)}</p>
                    </td>
                    <td className="columntwo">
                      <p>
                        <a
                          href={`/search?SearchableText=${content.ObjObjectTypeTxt}`}
                        >
                          {content.ObjObjectTypeTxt}
                        </a>
                      </p>
                    </td>
                  </tr>
                )}
                {content.ObjDateToTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.date)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.ObjDateToTxt}</p>
                    </td>
                  </tr>
                )}
                {content.ObjMaterialTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.material)}</p>
                    </td>
                    <td className="columntwo">
                      <p>
                        {materialsArray.map((material) => (
                          <span>
                            <a href={`/search?SearchableText=${material}`}>
                              {' '}
                              {material}
                            </a>
                          </span>
                        ))}
                      </p>
                    </td>
                  </tr>
                )}
                {content.ObjTechniqueTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.technique)}</p>
                    </td>
                    <td className="columntwo">
                      <p>
                        <a
                          href={`/search?SearchableText=${content.ObjTechniqueTxt}`}
                        >
                          {content.ObjTechniqueTxt}
                        </a>
                      </p>
                    </td>
                  </tr>
                )}
                {content.ObjAcquisitionMethodTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.acquisition)}</p>
                    </td>
                    <td className="columntwo">
                      <p>
                        {content?.ObjAcquisitionMethodTxt}{' '}
                        {content.ObjAcquisitionDateTxt
                          ? content.ObjAcquisitionDateTxt.slice(0, 4)
                          : ''}
                      </p>
                    </td>
                  </tr>
                )}
                {content.ObjDimensionTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.dimension)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.ObjDimensionTxt}</p>
                    </td>
                  </tr>
                )}
                {content.ObjPhysicalDescriptionTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.description)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.ObjPhysicalDescriptionTxt}</p>
                    </td>
                  </tr>
                )}
                {content.ObjCreditlineTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.credit)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.ObjCreditlineTxt}</p>
                    </td>
                  </tr>
                )}
                {content.ObjObjectNumberTxt && (
                  <tr>
                    <td className="columnone">
                      <p>{intl.formatMessage(messages.objectNumber)}</p>
                    </td>
                    <td className="columntwo">
                      <p>{content.ObjObjectNumberTxt}</p>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="columnone">
                    <p>{intl.formatMessage(messages.question)}</p>
                  </td>
                  <td className="columntwo">
                    <p>
                      {intl.formatMessage(messages.questionText)}
                      {intl.locale === 'nl' ? (
                        <a
                          href={`mailto:info@bonnefanten.nl?subject=opmerking%20over%20object:%${content.ObjObjectNumberTxt}`}
                        >
                          <span>Laat het ons weten!</span>
                        </a>
                      ) : (
                        <a
                          href={`mailto:info@bonnefanten.nl?subject=remark%20on%20this%20object:%${content.ObjObjectNumberTxt}`}
                        >
                          <span>Please let us know!</span>
                        </a>
                      )}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <SeeMore {...props} />
        </div>
      </Container>
    </div>
  );
}
