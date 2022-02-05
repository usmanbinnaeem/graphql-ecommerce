import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields"

export const OrderItem = list({
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: "textarea"
            }
        }),
        image: relationship({
            ref: 'ProductImage',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: { fields: ['image', 'altText'] },
                inlineEdit: { fields: ['image', 'altText'] },
            },
        }),

        status: select({
            options: [
                {
                    label: 'draft', value: 'DARFT'
                },
                {
                    label: 'available', value: 'AVAILABLE'
                },
                {
                    label: 'unavailable', value: 'UNAVAILABLE'
                },
            ],
            defaultValue: "DRAFT",
            ui: {
                displayMode: 'segmented-control',
                createView: { fieldMode: 'hidden' },
            },

        }),
        price: integer(),
        quantity: integer(),
        order: relationship({
            ref: 'Order.items',
        })

    }
})