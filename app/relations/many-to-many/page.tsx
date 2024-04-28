import db from "@/db/drizzle";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { books, publishers } from "@/db/schema";

export default async function Page() {
    // Create a publisher
    // const [oreilly] = await db.insert(publishers).values({
    //    email: "oreilly@gmail.com",
    //    name: "Oreilly",
    //    website: "https://www.oreilly.com/",
    // }).returning({
    //     id: publishers.id,
    // });
    //
    // const [book1] = await db.insert(books).values({
    //     isbn: "9781491914915",
    //     publicationDate: new Date("2020-01-01"),
    //     title: "Learning Javascript",
    //     publisherId: oreilly.id,
    // }).returning({
    //     id: books.id,
    // });
    //
    // const [book2] = await db.insert(books).values({
    //     isbn: "9791492914916",
    //     publicationDate: new Date("2021-01-01"),
    //     title: "Learning Python",
    //     publisherId: oreilly.id,
    // }).returning({
    //     id: books.id,
    // });
    //
    // const [contributor1] = await db.insert(contributors).values({
    //     email: "john@doe.com",
    //     firstName: "John",
    //     lastName: "Doe",
    // }).returning({
    //     id: contributors.id,
    // });
    //
    // const [contributor2] = await db.insert(contributors).values({
    //     email: "olivia@green.com",
    //     firstName: "Olivia",
    //     lastName: "Green",
    // }).returning({
    //     id: contributors.id,
    // });
    //
    // await db.insert(bookContributors).values([
    //     {
    //         bookId: book1.id,
    //         contributorId: contributor1.id,
    //     },
    //     {
    //         bookId: book1.id,
    //         contributorId: contributor2.id,
    //     },
    //     {
    //         bookId: book2.id,
    //         contributorId: contributor2.id,
    //     },
    // ]);

    const publishersData = await db.query.publishers.findMany({
        with: {
            books: {
                with: {
                    bookContributors: {
                        with: {
                            contributors: true,
                        },
                    },
                },
            },
        },
    });

    // const publishersData = await db.query.publishers.findMany({
    //     with: {
    //         books: true,
    //     },
    // });

    // const booksData = await db.query.books.findMany({
    //     where: eq(books.publisherId, publishersData[0].id),
    // });

    // console.log(booksData);

    return (
        <div className="p-4">
            <h1 className="font-bold text-2xl">Drizzle - Many to Many</h1>

            <h2 className="font-semibold text-xl mt-2">Publishers</h2>
            <ul>
                {publishersData.map(publisher => (
                    <li key={publisher.id}>{publisher.name}</li>
                ))}
            </ul>

            <h2 className="font-semibold text-xl mt-2">Books</h2>
            <ul>
                {publishersData[0].books.map((book) => (
                    <li key={book.id}>
                        <span className="font-semibold">Title: </span><span>{book.title}</span>
                        <ul>
                            {book.bookContributors.map(bookContributor => (
                                <li key={bookContributor.bookId + bookContributor.contributorId}>{bookContributor.contributors.firstName} {bookContributor.contributors.lastName}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}