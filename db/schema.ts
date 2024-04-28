import { createId } from "@paralleldrive/cuid2";
import { decimal, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const courses = pgTable("courses", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate").notNull(),
});

export const students = pgTable("students", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull(),
    courseId: text("courseId").references(() => courses.id, { onDelete: "cascade" }).notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    students: many(students),
}));

export const studentsRelations = relations(students, ({ one }) => ({
    courses: one(courses, {
        fields: [students.courseId],
        references: [courses.id],
    }),
}));

export const orders = pgTable("orders", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    customerId: text("customerId").notNull(),
    orderDate: timestamp("orderDate", { withTimezone: true }).notNull(),
    totalAmount: decimal("totalAmount").notNull(),
});

export const invoices = pgTable("invoices", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderId: text("orderId").references(() => orders.id, { onDelete: "cascade" }).notNull().unique(),
    invoiceDate: timestamp("invoiceDate", { withTimezone: true }).notNull(),
    totalAmount: decimal("totalAmount").notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
    invoices: one(invoices, {
        fields: [orders.id],
        references: [invoices.orderId],
    }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
    orders: one(orders, {
        fields: [invoices.orderId],
        references: [orders.id],
    })
}));

export const publishers = pgTable("publishers", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    website: text("website").notNull().unique(),
    email: text("email").notNull().unique(),
});

export const books = pgTable("books", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("name").notNull(),
    publicationDate: timestamp("publicationDate").notNull(),
    isbn: text("isbn").notNull().unique(),
    publisherId: text("publisherId").references(() => publishers.id, { onDelete: "cascade" }).notNull(),
});

export const contributors = pgTable("contributors", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("isbn").notNull().unique(),
});

export const bookContributors = pgTable("bookContributors", {
        bookId: text("bookId").notNull().references(() => books.id),
        contributorId: text("contributorId").notNull().references(() => contributors.id),
    }, (t) => ({
        pk: primaryKey({
            columns: [t.bookId, t.contributorId],
        }),
    }),
);

export const bookContributorsRelations = relations(bookContributors, ({ one }) => ({
    books: one(books, {
        fields: [bookContributors.bookId],
        references: [books.id],
    }),
    contributors: one(contributors, {
        fields: [bookContributors.contributorId],
        references: [contributors.id],
    }),
}));

export const publishersRelations = relations(publishers, ({ many }) => ({
    books: many(books),
}));

export const booksRelations = relations(books, ({ many, one }) => ({
    bookContributors: many(bookContributors),
    publishers: one(publishers, {
        fields: [books.publisherId],
        references: [publishers.id],
    }),
}));

export const contributorsRelation = relations(contributors, ({ many }) => ({
    contributors: many(bookContributors),
}));
