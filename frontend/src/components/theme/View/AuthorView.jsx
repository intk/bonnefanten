import React from 'react';
import { Container } from 'semantic-ui-react';
import './css/authorview.less';
import { SeeMoreAuthor } from '../../index';

export default function AuthorView(props) {
  // const intl = useIntl();
  // const { content } = props;
  return (
    <div id="object-block">
      {props.content.description && (
        <div className="description-wrapper">
          <div className="header-quotes-wrapper">
            <div className="quote-top-left quote-bonnefanten">“</div>
            <div className="quote-top-right quote-bonnefanten">”</div>
          </div>
          <p className="documentDescription">{props.content.description}</p>
        </div>
      )}
      <Container>
        <SeeMoreAuthor {...props} />
      </Container>
    </div>
  );
}
