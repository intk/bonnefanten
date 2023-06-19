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
    <div className="social-share-links">
      <ul>
        {socials.map((social) => (
          <li key={social.id}>
            <a
              href={social.url}
              title={social.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={social.icon} size="large" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareLinks;
