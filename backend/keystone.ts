import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth'
import { withItemData, statelessSessions } from "@keystone-next/keystone/session"
import 'dotenv/config';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { extendGraphqlSchema } from './mutations/index';
import { sendPasswordResetEmail } from './lib/mail';
import { permissionsList } from './schemas/fields';

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
    },
    passwordResetLink: {
        async sendToken(args) {
           await sendPasswordResetEmail(args.token, args.identity);
        },
    },
})

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: "mongoose",
        url: databaseUrl,
    },
    lists: createSchema({
        User,
        Product,
        ProductImage,
        CartItem,
        OrderItem,
        Order,
        Role,
    }),
    extendGraphqlSchema,
    ui: {

        isAccessAllowed: ({ session }) => {
            return !!session?.data;

        },
    },
    session: withItemData(statelessSessions(sessionConfig), {
        User: `id name email role { ${ permissionsList.join(' ')} }`,
    }),
}));

