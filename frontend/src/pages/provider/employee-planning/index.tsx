import { useState } from "react"
import { Employee, Session } from "@/utils/types"
import { useAuth } from "@/context/AuthContext"
import EmployeeCalendar from "@/components/planning/employee-planning/employee-calendar"
import { SessionDetails } from "@/components/planning/employee-planning/session-details"

function EmployeePlanning() {
  const [selectedSession, setSelectedSession] = useState<Session>()
  const employee = useAuth().user as Employee

  return (
    <div>
      <div className="flex">
        <EmployeeCalendar setSelectedSession={setSelectedSession} instructor={employee} />
        <SessionDetails session={selectedSession} />
      </div>
    </div>
  )
}

export default EmployeePlanning
