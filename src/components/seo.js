import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

// TODO: re-work when static query + themes is fixed
function SEO({
  author,
  description,
  lang,
  image,
  meta,
  keywords,
  siteUrl,
  title,
  twitter,
}) {
  const metaImage = image && image.src ? `${siteUrl}${image.src}` : null
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${author}`}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `article:author`,
          content: author,
        },
        {
          name: `twitter:creator`,
          content: twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(
          metaImage
            ? [
                {
                  property: 'og:image',
                  content: metaImage,
                },
                {
                  property: 'og:image:width',
                  content: image.width,
                },
                {
                  property: 'og:image:height',
                  content: image.height,
                },
                {
                  property: 'twitter:card',
                  content: 'summary_large_image',
                },
              ]
            : [
                {
                  name: `twitter:card`,
                  content: `summary`,
                },
              ]
        )
        .concat(meta)}
    />
  )
}

SEO.defaultProps = {
  author: 'Dustin Schau',
  description:
    'The blog of the Omaha, Nebraska based software engineer, Dustin Schau',
  lang: `en`,
  meta: [],
  keywords: [],
  siteUrl: 'https://blog.dustinschau.com',
  twitter: '@schaudustin',
}

SEO.propTypes = {
  author: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  twitter: PropTypes.string,
}

export default SEO
