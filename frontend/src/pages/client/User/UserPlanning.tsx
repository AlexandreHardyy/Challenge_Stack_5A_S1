import { useState } from "react"
import { Student } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import StudentCalendar from "@/components/planning/user-plannning/user-calendar"
import { SessionDetails } from "@/components/planning/user-plannning/session-details"
import { useFetchUserById } from "@/services/user/user.service"
import { Spinner } from "@/components/loader/Spinner"
import { useFetchSessionsByStudent } from "@/services/sessions.service"

function UserPlanning() {
  const [selectedSessionId, setSelectedSessionId] = useState<number | undefined>()
  const { user } = useAuth()
  const student = useFetchUserById(user?.id)
  const sessions = useFetchSessionsByStudent(user?.id)

  if (student.isLoading || sessions.isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="flex justify-center w-4/5 mx-auto mb-10">
        <StudentCalendar
          setSelectedSessionId={setSelectedSessionId}
          student={student.data as Student}
          sessions={sessions}
        />
        <SessionDetails sessionId={selectedSessionId} />
      </div>
    </div>
  )
}

export default UserPlanning
