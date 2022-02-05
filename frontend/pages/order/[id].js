import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import OrderStyles from '../../components/styles/OrderStyles'
import Head from 'next/head'
import formatMoney from '../../lib/formatMoney'

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        image {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`

const OrderPage = ({ query }) => {
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id: query.id,
    },
  })
  if (error) return <ErrorMessage error={error} />
  if (loading) return <p>Loading...</p>
  const { order } = data
  return (
    <OrderStyles>
      <Head>
        <title>SIck Fits - ${order.id}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>ItemCount</span>
        <span>{order.items.length}</span>
      </p>
      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.image.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each : {formatMoney(item.price)}</p>
              <p>Sub total : {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  )
}

export default OrderPage
