/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';

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

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String!
    $price: Int!
    $desc: String! # $image: Upload
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $desc
        # status: "AVAILABLE"
        price: $price
        # image: { create: { image: $image, altText: $name } }
      }
    ) {
      id
    }
  }
`;

const UpdateProduct = ({ id }) => {
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });

  //   if (error) return <DisplayError error={error} />;

  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange, resetForm, clearForm } = useForm(data?.Product);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await updateProduct({
            variables: {
              id,
              name: inputs.name,
              desc: inputs.description,
              price: inputs.price,
            },
          });
          //   clearForm();
          //   Router.push({ pathname: `/product/${res.data.createProduct.id}` });
        }}
      >
        <DisplayError error={error || updateError} />
        <fieldset disabled={updateLoading} aria-busy={updateLoading}>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
            />
          </label>

          <label htmlFor="desc">
            Description
            <textarea
              style={{ resize: 'none' }}
              rows={15}
              name="desc"
              id="desc"
              placeholder="Add Description"
              value={inputs.description}
              onChange={handleChange}
            />
          </label>

          <label htmlFor="price">
            Price
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Price"
              value={inputs.price}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Update Product</button>
          {/* <button type="button" onClick={clearForm}>
          Clear Form
        </button>
        <button type="button" onClick={resetForm}>
          Reset Form
        </button> */}
        </fieldset>
      </Form>
    </div>
  );
};

export default UpdateProduct;
