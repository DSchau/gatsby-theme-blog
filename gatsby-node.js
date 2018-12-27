const path = require('path');
const { GraphQLString } = require('gatsby/graphql');
const slugify = require('limax');

const createTagPages = (createPage, edges) => {
  const tagTemplate = require.resolve(`./dist/templates/tags.js`);
  const posts = {};

  edges
    .forEach(({ node }) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags
          .forEach(tag => {
            if (!posts[tag]) {
              posts[tag] = [];
            }
            posts[tag].push(node);
          });
      }
    });

  const tags = Object.keys(posts);
  
  createPage({
    path: '/tags',
    component: tagTemplate,
    context: {
      tags
    }
  });

  Object.keys(posts)
    .forEach(tagName => {
      const tag = posts[tagName];
      createPage({
        path: `/tags/${tagName}`,
        component: tagTemplate,
        context: {
          tags,
          tag,
          tagName
        }
      })
    });
};

exports.createPages = function createPages({ actions, graphql }) {
  const { createPage } = actions;

  const blogPostTemplate = require.resolve(`./dist/templates/blog-post.js`);

  const draftFilter = `
    filter: {
      frontmatter: { draft: { ne: true }}
    }
  `;

  return graphql(`{
    allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___date] }
      ${process.env.NODE_ENV === 'production' ? draftFilter : ''}
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          timeToRead
          slug
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            draft
            tags
            title
          }
        }
      }
    }
  }`)
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors)
      }

      const posts = result.data.allMarkdownRemark.edges;

      createTagPages(createPage, posts);

      // Create pages for each markdown file.
      posts.forEach(({ node }, index) => {
        const { slug } = node;
        createPage({
          path: slug,
          component: blogPostTemplate,
          context: {
            prev: index === 0 ? null : posts[index - 1].node,
            next: index === posts.length - 1 ? null : posts[index + 1].node,
            slug
          }
        });
      });

      return posts;
    });
};


exports.setFieldsOnGraphQLNodeType = function setFieldsOnGraphQLNode({ type }) {
  switch (type.name) {
    case 'MarkdownRemark':
      return {
        type: {
          type: GraphQLString,
          resolve(source) {
            const { fileAbsolutePath } = source;
            const [,folder] = fileAbsolutePath.split(path.resolve('content')).pop().split('/');
            return folder;
          }
        },
        slug: {
          type: GraphQLString,
          resolve(source) {
            const { frontmatter } = source;
            return frontmatter.path || frontmatter.slug || `/${slugify(frontmatter.title)}`;
          }
        }
      }
    default:
      return {};
  }
};