import { KeystoneContext } from "@keystone-next/types"
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from "../types";

const addToCart = async (root: any, { productId }: { productId: string }, context: KeystoneContext): Promise<CartItemCreateInput> => {

    const sesh = context.session as Session;
    if (!sesh.itemId) {
        throw new Error('You must be login to do this!');
    }

    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId } },
        resolveFields: 'id,quantity'
      });

  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(existingCartItem)
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1!`
    );
    // 3. See if the current item is in their cart
    // 4. if itis, increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId }},
      user: { connect: { id: sesh.itemId }},
    },
    resolveFields: false,
  })
}

export default addToCart;