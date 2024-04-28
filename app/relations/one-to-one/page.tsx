import db from "@/db/drizzle";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { orders } from "@/db/schema";

export default async function Page() {
    const order = await db.query.orders.findFirst({
        where: eq(orders.id, "oi5bb1hwq3r7ngja3fn0du0y"),
        with: {
            invoices: true,
        },
    });

    console.log(order);

    const invoices = await db.query.invoices.findFirst({
        where: eq(orders.id, "hp9rjftkm92p4v5iuuok69ts"),
        with: {
            orders: true,
        },
    });

    console.log(invoices);

    return (
        <div>One to one Relation - Orders x Invoices</div>
    );
}