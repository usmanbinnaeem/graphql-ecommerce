/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Product from './Product';
import { perPage } from '../config';

export const QUERY_ALL_PRODUCTS = gql`
  query QUERY_ALL_PRODUCTS($skip: Int = 0, $first: Int) {
    allProducts(first: $first, skip: $skip) {
      id
      name
      description
      status
      price
      image {
        id
        image {
          publicUrlTransformed
        }
        altText
      }
    }
  }
`;

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export const Products = ({ page }) => {
  const { data, error, loading } = useQuery(QUERY_ALL_PRODUCTS, {
    variables: {
      first: perPage,
      skip: page * perPage - perPage,
    },
  });
  if (loading) return <h3>Loading......</h3>;
  if (error) return <h3>Error {error.message}</h3>;
  return (
    <>
      <ProductListStyles>
        {data.allProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductListStyles>
    </>
  );
};
