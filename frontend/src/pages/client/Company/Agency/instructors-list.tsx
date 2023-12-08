import { User } from "@/utils/types"

export function InstructorsList({ instructors }: { instructors: Pick<User, "id" | "firstname" | "lastname">[] }) {
  return (
    <div className="flex gap-[40px]">
      {instructors.map((instructor) => (
        <div key={instructor.id} className="flex flex-col items-center gap-[15px]">
          <img
            className="rounded-[200px] w-[200px] h-[200px]"
            alt="monititor-picture"
            src="https://yt3.googleusercontent.com/bVsqJPvzGWmifywdIj9srMNA-39rStHuPm4KOuVac9CVM3uMegew_he4Btnq4EdMfwBsEexMmQ=s900-c-k-c0x00ffffff-no-rj"
          />
          <p>
            {instructor.lastname} {instructor.firstname}
          </p>
        </div>
      ))}
    </div>
  )
}
