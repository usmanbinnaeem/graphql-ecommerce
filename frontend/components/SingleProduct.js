/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      image {
        image {
          publicUrlTransformed
        }
        altText
      }
      status
    }
  }
`;

const SingleProduct = ({ id }) => {
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError />;

  const { Product } = data;

  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits || {Product.name}</title>
      </Head>
      <img
        src={Product.image.image.publicUrlTransformed}
        alt={Product.image.altText}
      />
      <div className="details">
        <h2>{Product.name}</h2>
        <p>{Product.price}</p>
        <p>{Product.description}</p>
      </div>
    </ProductStyles>
  );
};
export default SingleProduct;
