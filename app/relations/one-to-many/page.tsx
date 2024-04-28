import db from "@/db/drizzle";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { courses } from "@/db/schema";

export default async function Page() {
    const coursesData = await db.query.courses.findFirst({
        where: eq(courses.id, "zbhezdvevr6le35bbra9t9vf"),
        with: {
            students: true,
        },
    });

    console.log(coursesData);

    return (
        <div>One to many Relation - Courses x Students</div>
    );
}