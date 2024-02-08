import { SelectInput } from "@/components/select-input"
import { User } from "@/utils/types"
import { useTranslation } from "react-i18next"

type InstructorSelectProps = {
  instructors: Pick<User, "id" | "firstname" | "lastname">[]
  setSelectedInstructor: (instructor?: string) => void
}

export function InstructorSelect({ instructors, setSelectedInstructor }: InstructorSelectProps) {
  const { t } = useTranslation()

  const options = [
    { value: "noPreferences", label: t("serviceClient.instructorsSelector.noPreferences") },
    ...instructors.map((instructor) => {
      return { value: `${instructor.id}`, label: `${instructor.lastname} ${instructor.firstname}` }
    }),
  ]

  return (
    <SelectInput
      options={options}
      placeholder={t("serviceClient.instructorsSelector.placeholder")}
      onSelect={(instructor: string) => {
        if (instructor === "noPreferences") {
          setSelectedInstructor(undefined)
        } else {
          setSelectedInstructor(instructor)
        }
      }}
    />
  )
}
