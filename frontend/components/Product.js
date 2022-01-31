/* eslint-disable react/prop-types */
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import DeleteProduct from './DeleteProduct';

const Product = ({ product }) => (
  <ItemStyles>
    <img
      src={product?.image?.image?.publicUrlTransformed}
      alt={product.image.altText}
    />
    <Title>
      <Link href={`/product/${product.id}`}>{product.name}</Link>
    </Title>
    <PriceTag>{formatMoney(product.price)}</PriceTag>
    <p>{product.description}</p>
    <div className="buttonList">
      <Link
        href={{
          pathname: 'update',
          query: {
            id: product.id,
          },
        }}
      >
        Edit
      </Link>
      <DeleteProduct id={product.id}>Delete</DeleteProduct>
    </div>
  </ItemStyles>
);

export default Product;
