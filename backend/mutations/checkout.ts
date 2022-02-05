import { KeystoneContext } from "@keystone-next/types"
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from "../lib/stripe";

const checkout = async (root: any, { token }: { token: string }, context: KeystoneContext): Promise<OrderCreateInput> => {
    const graphql = String.raw;
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error("Sorry! You must be Sign In to create an Order")
    }

    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
    id
    name
    email
    cart {
        id
        quantity
        product {
            id
            name
            price
            description
            image{
                id
                image{
                    id
                    publicUrlTransformed
                }
            }
        }
    }
    `
    })
    console.dir(user, { depth: null });
    const cartItems = user.cart.filter(CartItem => CartItem.product);
    const amount = cartItems.reduce(function (tally: number, cartItem: CartItemCreateInput) {
        return tally + cartItem.quantity * cartItem.product.price;
    }, 0);
    // console.log(amount);
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err);
        throw new Error(err.message);
    })
    // console.log(charge);

    const orderItems = cartItems.map(cartItem => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            image: { connect: { id: cartItem.product.image.id } },
        }
        return orderItem;
    })

    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } }
        }
    })

    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds
    })

    return order;
}

export default checkout;