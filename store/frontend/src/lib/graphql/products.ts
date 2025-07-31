import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      nameEn
      description
      descriptionEn
      slug
      isActive
      sortOrder
      subcategories {
        id
        name
        nameEn
        slug
        isActive
        sortOrder
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      name
      nameEn
      slug
      price
      comparePrice
      stockQuantity
      isFeatured
      category {
        id
        name
        nameEn
        slug
      }
      brand {
        id
        name
        nameEn
        slug
      }
      images {
        id
        alt
        title
        isDefault
        sortOrder
        fileUpload {
          id
          filename
          path
          mimetype
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int) {
    products(limit: $limit, offset: $offset) {
      id
      name
      nameEn
      slug
      price
      comparePrice
      stockQuantity
      isFeatured
      category {
        id
        name
        nameEn
        slug
      }
      brand {
        id
        name
        nameEn
        slug
      }
      images {
        id
        alt
        title
        isDefault
        sortOrder
        fileUpload {
          id
          filename
          path
          mimetype
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      nameEn
      slug
      description
      descriptionEn
      shortDesc
      shortDescEn
      price
      comparePrice
      stockQuantity
      isFeatured
      category {
        id
        name
        nameEn
        slug
      }
      subcategory {
        id
        name
        nameEn
        slug
      }
      brand {
        id
        name
        nameEn
        slug
      }
      images {
        id
        alt
        title
        isDefault
        sortOrder
        fileUpload {
          id
          filename
          path
          mimetype
        }
      }
      attributes {
        id
        name
        nameEn
        attributeType
        options
        isRequired
        isVariant
        sortOrder
      }
      variations {
        id
        sku
        price
        comparePrice
        stockQuantity
        isActive
        attributes {
          id
          value
          valueEn
          colorHex
          sortOrder
        }
      }
    }
  }
`;