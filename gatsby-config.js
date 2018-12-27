const path = require('path')

module.exports = function themeConfig({
  blogContent = path.join('content', 'blog'),
  root
} = {}) {
  const relative = () => path.relative(
    root,
    path.join(__dirname, to)
  )

  return {
    siteMetadata: {
      title: 'Dustin Schau - Blog',
      author: 'Dustin Schau',
    },
    plugins: [
      {
        resolve: 'gatsby-plugin-manifest',
        options: {
          name: `Dustin Schau's Blog`,
          description: 'The blog of the developer, Dustin Schau',
          short_name: 'DSchau Blog',
          background_color: 'white',
          theme_color: '#002635',
          orientation: 'portrait',
          display: 'minimal-ui',
        },
      },
      'gatsby-plugin-catch-links',
      'gatsby-plugin-emotion',
      'gatsby-plugin-remove-trailing-slashes',
      'gatsby-plugin-twitter',
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: path.join(root, blogContent),
          name: 'post',
        },
      },
      {
        resolve: `gatsby-transformer-remark`,
        options: {
          plugins: [
            'gatsby-remark-copy-linked-files',
            {
              resolve: 'gatsby-remark-images',
              options: {
                backgroundColor: 'transparent',
                linkImagesToOriginal: false,
                showCaptions: true,
              },
            },
            'gatsby-remark-prismjs',
            'gatsby-remark-smartypants',
            'gatsby-remark-autolink-headers',
          ],
        },
      },
      'gatsby-plugin-react-helmet',
      {
        resolve: 'gatsby-plugin-layout',
        options: {
          component: relative(
            path.join('src', 'layouts', 'index.js')
          )
        }

      },
      'gatsby-transformer-sharp',
      'gatsby-plugin-sharp',
      'gatsby-plugin-offline',
      {
        resolve: 'gatsby-plugin-typography',
        options: {
          omitGoogleFont: true,
          pathToConfigModule: relative(path.join('src', 'utils', 'typography.js')),
        },
      },
      {
        resolve: 'gatsby-plugin-google-analytics',
        options: {
          trackingId: 'UA-102928446-2',
        },
      },
    ],
  }
};
