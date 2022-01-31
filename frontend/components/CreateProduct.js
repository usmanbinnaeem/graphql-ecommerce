import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { QUERY_ALL_PRODUCTS } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $price: Int!
    $desc: String!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $desc
        status: "AVAILABLE"
        price: $price
        image: { create: { image: $image, altText: $name } }
      }
    ) {
      id
    }
  }
`;

const CreateProduct = () => {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    image: '',
    name: '',
    desc: '',
    price: 0,
  });

  const [createProduct, { data, error, loading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: QUERY_ALL_PRODUCTS }],
    }
  );

  return (
    <div>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          // console.log(inputs);
          const res = await createProduct();
          clearForm();
          Router.push({ pathname: `/product/${res.data.createProduct.id}` });
        }}
      >
        <DisplayError error={error} />
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="image">
            Upload Image
            <input
              required
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
            />
          </label>

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
              value={inputs.desc}
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
          <button type="submit">+ Add Product</button>
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

export default CreateProduct;
