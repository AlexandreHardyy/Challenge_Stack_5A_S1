import api from "@/utils/api"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { ScheduleExceptionsFormSchema, ScheduleFormSchema } from "@/zod-schemas/schedule"
import { useQuery } from "@tanstack/react-query"
import { Employee, Schedule, ScheduleException } from "@/utils/types"

export const useAddSchedule = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (params: ScheduleFormSchema) => {
      const result = await api
        .post("schedules", {
          ...params,
          startHour: Number(params.startHour),
          endHour: Number(params.endHour),
          dateRange: {
            from: format(params.dateRange.from, "yyyy-MM-dd"),
            to: format(params.dateRange.to ?? params.dateRange.from, "yyyy-MM-dd"),
          },
        })
        .catch((err) => err.response)

      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.error"),
        })
      }

      return result
    },
  })
}

export function useFetchScheduleByUser(userId?: number) {
  return useQuery({
    queryKey: ["getSchedulesByUser"],
    queryFn: async (): Promise<Schedule[]> => {
      const schedules = await api.get(`users/${userId}/schedules`)

      return schedules?.data["hydra:member"]
    },
  })
}

export function useFetchScheduleExceptionsByCompany(companyId?: number) {
  return useQuery({
    queryKey: ["getScheduleExceptions"],
    queryFn: async (): Promise<ScheduleException[]> => {
      const employees = (await api.get(`companies/${companyId}/users`))?.data["hydra:member"]

      const scheduleExceptions = (
        await Promise.all(
          employees?.map((employee: Employee) => {
            return api.get(`users/${employee.id}/schedules`)
          })
        )
      )
        .map((response) => response.data["hydra:member"])
        .reduce((result: object[], schedules: Schedule[], index: number) => {
          for (const schedule of schedules) {
            for (const scheduleExceptions of schedule.scheduleExceptions) {
              result.push({
                firstname: employees[index].firstname,
                lastname: employees[index].lastname,
                date: schedule.date,
                ...scheduleExceptions,
              })
            }
          }
          return result
        }, [])
      return scheduleExceptions
    },
  })
}

export function useFetchScheduleExceptionsByEmployee(employeeId?: number) {
  return useQuery({
    queryKey: ["getScheduleExceptions"],
    queryFn: async (): Promise<ScheduleException[]> => {
      const response = await api.get(`users/${employeeId}/schedules`)
      if (response.status !== 200) {
        throw new Error("Something went wrong with the request (getScheduleExceptions)")
      }

      const scheduleExceptions = response.data["hydra:member"].reduce((result: object[], schedule: Schedule) => {
        for (const scheduleExceptions of schedule.scheduleExceptions) {
          result.push({
            date: schedule.date,
            ...scheduleExceptions,
          })
        }

        return result
      }, [])

      return scheduleExceptions
    },
  })
}

export const useAddScheduleException = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (body: ScheduleExceptionsFormSchema) => {
      const result = await api
        .post(
          `schedule_exceptions`,
          {
            ...body,
            startHour: Number(body.startHour),
            endHour: Number(body.endHour),
          },
          {
            headers: {
              "Content-Type": "application/ld+json",
            },
          }
        )
        .catch((err) => err.response)
      if (result.status === 201) {
        toast({
          variant: "success",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.successCreateException"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.error"),
        })
      }

      return result
    },
  })
}

export const useValidateScheduleException = (id: number) => {
  const { toast } = useToast()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: async (status: string) => {
      const result = await api
        .patch(
          `schedule_exceptions/${id}`,
          { status },
          {
            headers: {
              "Content-Type": "application/merge-patch+json",
            },
          }
        )
        .catch((err) => err.response)

      if (result.status === 200) {
        toast({
          variant: "success",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.successUpdate"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("employeePage.toast.title"),
          description: t("employeePage.toast.error"),
        })
      }

      return result
    },
  })
}
