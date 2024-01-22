import { useState } from "react"
import EmployeeCalendar from "./employee-calendar"
import { SessionDetails } from "./session-details"
import { Session } from "@/utils/types"

function EmployeePlanning() {
  const [selectedSession, setSelectedSession] = useState<Session>()

  return (
    <div>
      <div className="flex">
        <EmployeeCalendar setSelectedSession={setSelectedSession} />
        <SessionDetails session={selectedSession} />
      </div>
    </div>
  )
}

export default EmployeePlanning
