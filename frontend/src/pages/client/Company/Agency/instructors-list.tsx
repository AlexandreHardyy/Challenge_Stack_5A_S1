import UserAvatar from "@/components/user-avatar"
import { User } from "@/utils/types"

export function InstructorsList({
  instructors,
}: {
  instructors: Pick<User, "id" | "firstname" | "lastname" | "image" | "email">[]
}) {
  return (
    <div className="flex gap-[40px]">
      {instructors.map((instructor) => (
        <div key={instructor.id} className="flex flex-col items-center gap-[15px]">
          <UserAvatar
            email={instructor.email ?? ""}
            image={instructor.image?.contentUrl ?? null}
            className="rounded-[200px] w-[200px] h-[200px] object-cover"
          />
          <p>
            {instructor.lastname} {instructor.firstname}
          </p>
        </div>
      ))}
    </div>
  )
}
