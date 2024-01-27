/**
 * Share Links
 * @module components/theme/ShareLinks/ShareLinks
 */
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';

const ShareLinks = () => {
  const [targetUrl, setTargetUrl] = useState();
  const title = useSelector((state) => state.content.data?.title);

  const socials = useMemo(
    () => [
      {
        id: 'facebook',
        title: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${targetUrl}`,
        icon: 'facebook',
      },
      {
        id: 'twitter',
        title: 'Twitter',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title,
        )}&url=${targetUrl}`,
        icon: 'twitter',
      },
      {
        id: 'email',
        title: 'Email',
        url: `mailto:?subject=${
          title?.length > 0 ? encodeURIComponent(title) : targetUrl
        }&body=${targetUrl}`,
        icon: 'mail outline',
      },
    ],
    [targetUrl, title],
  );

  useEffect(() => {
    setTargetUrl(window.location.href);
  }, []);

  return (
    <div className="social-share-links" style={{ clear: 'both' }}>
      <ul>
        {socials.map((social) => (
          <li key={social.id}>
            <a
              href={social.url}
              title={social.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.id === 'twitter' ? (
                <svg
                  // id="twitter-rrssb-svg"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="28"
                  viewBox="0 0 1200 1277"
                >
                  <path
                    d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <Icon name={social.icon} size="large" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareLinks;
