/* eslint-disable react/prop-types */
import UpdateProduct from '../components/UpdateProduct';

const UpdateProductPage = ({ query }) => (
  <>
    <UpdateProduct id={query.id} />
  </>
);

export default UpdateProductPage;
