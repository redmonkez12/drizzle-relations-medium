import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../db/schema";
import { createId } from "@paralleldrive/cuid2";

const sql = postgres(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        const courses = await db.insert(schema.courses).values([
            {
                name: "Learning Python",
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: "Learning Javascript",
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: "Learning Next",
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: "Learning Express",
                startDate: new Date(),
                endDate: new Date(),
            },
            {
                name: "Learning Qwik",
                startDate: new Date(),
                endDate: new Date(),
            },
        ]).returning({ id: schema.courses.id });

        for (const course of courses) {
            await db.insert(schema.students).values([
                {
                    courseId: course.id,
                    firstName: "Tomas",
                    lastName: "Svojanovsky",
                    email: "tomas.svojanovsky@gmail.com",
                },
                {
                    courseId: course.id,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@gmail.com",
                },
                {
                    courseId: course.id,
                    firstName: "Olivia",
                    lastName: "Green",
                    email: "olivia.green@gmail.com",
                },
            ]);
        }

        // const orders = await db.insert(schema.orders).values([
        //     {
        //         totalAmount: "1000",
        //         customerId: createId(),
        //         orderDate: new Date(),
        //     },
        //     {
        //         totalAmount: "2000",
        //         customerId: createId(),
        //         orderDate: new Date(),
        //     },
        //     {
        //         totalAmount: "3000",
        //         customerId: createId(),
        //         orderDate: new Date(),
        //     },
        // ]).returning({ id: schema.orders.id, totalAmount: schema.orders.totalAmount });
        //
        // for (const order of orders) {
        //     await db.insert(schema.invoices).values({
        //         totalAmount: order.totalAmount,
        //         orderId: order.id,
        //         invoiceDate: new Date(),
        //     });
        // }

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();