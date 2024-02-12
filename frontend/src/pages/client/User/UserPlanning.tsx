import { useState } from "react"
import { Session, Student } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import StudentCalendar from "@/components/planning/user-plannning/user-calendar"
import { SessionDetails } from "@/components/planning/user-plannning/session-details"
import { useFetchUserById } from "@/services/user/user.service"
import { Spinner } from "@/components/loader/Spinner"

function UserPlanning() {
  const [selectedSession, setSelectedSession] = useState<Session | undefined>()
  const { user } = useAuth()
  const student = useFetchUserById(user?.id)

  if (student.isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="flex justify-center w-4/5 mx-auto mb-10">
        <StudentCalendar setSelectedSession={setSelectedSession} student={student.data as Student} />
        <SessionDetails session={selectedSession} />
      </div>
    </div>
  )
}

export default UserPlanning
