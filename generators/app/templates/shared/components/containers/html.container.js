import React, {PropTypes} from 'react';
import helmet from 'react-helmet';
import serialize from 'serialize-javascript';

export default function HTMLDocument(props) {
  const head = helmet.rewind();
  const state = props.store.getState();
  const serialized = `window.__data=${serialize(state)}`;
  
  const foucStyles = `
  body, p, span, label, a {
    font-family: Helvetica;
  }
  `;
  
  return (
    <html>
      <head lang="en">
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"/>
        {head.meta.toComponent()}

        {head.title.toComponent()}
        <link rel="stylesheet" href="/assets/css/vendor.bundle.css"/>
        <link rel="stylesheet" href="/assets/css/app.bundle.css"/>
        <link rel="shortcut icon" type="image/png" href="/assets/favicon.png"/>
        <style>{foucStyles}</style>
        {head.link.toComponent()}
      </head>
      <body>
        <div id="app-wrapper" 
        dangerouslySetInnerHTML={{ __html: props.body }}
        ></div>

        <script type="text/javascript" defer src="/assets/js/vendor.bundle.js"></script>
        <script type="text/javascript" defer src="/assets/js/app.bundle.js"></script>

        <script 
        charSet="UTF-8"
        dangerouslySetInnerHTML={{__html: serialized}} 
        />
      </body>
    </html>
  )
}

HTMLDocument.propTypes = {
  body: PropTypes.string,
  store: PropTypes.object
}
