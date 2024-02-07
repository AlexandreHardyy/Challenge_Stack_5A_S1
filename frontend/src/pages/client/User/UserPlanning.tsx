import { useState } from "react"
import { Session, Student } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import StudentCalendar from "@/components/planning/user-plannning/user-calendar"
import { SessionDetails } from "@/components/planning/user-plannning/session-details"

function UserPlanning() {
  const [selectedSession, setSelectedSession] = useState<Session>()
  const student = useAuth().user as Student

  return (
    <div>
      <div className="flex justify-center w-4/5 mx-auto mb-10">
        <StudentCalendar setSelectedSession={setSelectedSession} student={student} />
        <SessionDetails session={selectedSession} />
      </div>
    </div>
  )
}

export default UserPlanning
