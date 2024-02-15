import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { ColumnDef } from "@tanstack/react-table"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useContext, useState } from "react"
import { EyeIcon, PencilIcon } from "lucide-react"
import { SelectMultiple } from "@/components/select-multiple"
import {
  addNewEmployee,
  updateEmployeeById,
  useDeleteUserById,
  useFetchEmployeesByCompany,
} from "@/services/user/user.service"
import { Agency, Employee, User } from "@/utils/types"
import { useFetchAgenciesByCompany } from "@/services/agency.service"
import { UseQueryResult, useQueryClient } from "@tanstack/react-query"
import { Spinner } from "@/components/loader/Spinner"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { DeleteModal } from "@/components/delete-modal"
import { t } from "i18next"
import { DataTable } from "@/components/Table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: () => t("ProviderEmployee.form.email"),
  },
  {
    accessorKey: "firstname",
    header: () => t("ProviderEmployee.form.firstName"),
  },
  {
    accessorKey: "lastname",
    header: () => t("ProviderEmployee.form.lastName"),
  },
  {
    accessorKey: "phoneNumber",
    header: () => t("ProviderEmployee.form.phoneNumber"),
  },
  {
    accessorKey: "agencies",
    cell: ({ row }) => {
      const agencies = row.getValue("agencies") as Agency[]
      return agencies.map((agency) => agency.name).join(", ")
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { original: employee } }) => {
      return <ActionColumn employee={employee} />
    },
  },
]

const ActionColumn = ({ employee }: { employee: User }) => {
  const deleteEmployee = useDeleteUserById()
  const queryClient = useQueryClient()

  return (
    <div className="flex items-center gap-4">
      <ModalFormEmployee employee={employee} />
      <Button asChild className="px-2" variant={"ghost"}>
        <Link to={`/provider/employee/${employee.id}`}>
          <EyeIcon />
        </Link>
      </Button>
      <DeleteModal
        name={employee.email}
        onDelete={async () => {
          await deleteEmployee.mutateAsync(employee.id)
          queryClient.invalidateQueries(["getEmployees"])
        }}
      />
    </div>
  )
}

const employeeFormSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(2, {
    message: "FirstName must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "FirstName must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Wrong number.",
  }),
  agencies: z.array(z.string()).optional(),
})

const EmployeeForm = ({
  employee,
  isReadOnly,
}: {
  employee?: Pick<Employee, "id" | "email" | "firstname" | "lastname" | "phoneNumber" | "agencies">
  isReadOnly: boolean
}) => {
  const { toast } = useToast()
  const { agencies, employees } = useContext(EmployeeContext)
  const { t } = useTranslation()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: employee?.email ?? "",
      firstname: employee?.firstname ?? "",
      lastname: employee?.lastname ?? "",
      phoneNumber: employee?.phoneNumber ?? "",
    },
  })
  const onSubmit = async (values: z.infer<typeof employeeFormSchema>) => {
    const result = await (!employee
      ? addNewEmployee(user?.company?.id, values)
      : updateEmployeeById(employee!.id, values))
    if (result.status === 201) {
      toast({
        variant: "success",
        title: t("ProviderEmployee.form.toast.title"),
        description: t("ProviderEmployee.form.toast.successCreate"),
      })
      employees?.refetch()
    } else if (result.status === 200) {
      toast({
        variant: "success",
        title: t("ProviderEmployee.form.toast.title"),
        description: t("ProviderEmployee.form.toast.successUpdate"),
      })
      employees?.refetch()
    } else {
      toast({
        variant: "destructive",
        title: t("ProviderEmployee.form.toast.title"),
        description: t("ProviderEmployee.form.toast.error"),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.form.email")}</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.form.firstName")}</FormLabel>
              <FormControl>
                <Input placeholder="Firstname" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.form.lastName")}</FormLabel>
              <FormControl>
                <Input placeholder="Lastmame" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common.form.phoneNumber")}</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {employee && (
          <FormField
            control={form.control}
            name="agencies"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>{t("ProviderEmployee.form.agencies")}</FormLabel>
                  {agencies && !agencies.isLoading && agencies.data && (
                    <FormControl>
                      <SelectMultiple
                        onChange={(values) => form.setValue("agencies", values)}
                        options={agencies.data?.map((agency) => ({ value: agency["@id"] ?? "", label: agency.name }))}
                        defaultData={employee?.agencies?.map((agency) => ({
                          value: agency["@id"] ?? "",
                          label: agency.name,
                        }))}
                        placeholder="Select agency where the employee works..."
                        disabled={isReadOnly}
                      />
                    </FormControl>
                  )}
                  {agencies && agencies.isLoading && <Spinner />}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        {!isReadOnly && (
          <Button type="submit">
            {employee ? t("ProviderEmployee.form.cta.updateEmployee") : t("ProviderEmployee.form.cta.addEmployee")}
          </Button>
        )}
      </form>
    </Form>
  )
}

const ModalFormEmployee = ({
  employee,
  variant = "ghost",
}: {
  employee?: Pick<Employee, "id" | "email" | "firstname" | "lastname" | "phoneNumber" | "agencies">
  variant?: "ghost" | "outline"
}) => {
  const [isReadOnly, setIsReadOnly] = useState(!!employee)
  const { t } = useTranslation()

  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!employee)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!employee ? t("ProviderEmployee.form.cta.addEmployee") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!employee ? (
              t("ProviderEmployee.form.cta.addEmployee")
            ) : (
              <>
                Your employee{" "}
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                    {" "}
                    <PencilIcon />{" "}
                  </Button>
                )}{" "}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <EmployeeForm employee={employee} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const EmployeeContext = React.createContext<{
  employees?: UseQueryResult<User[], unknown>
  agencies?: UseQueryResult<Agency[], unknown>
}>({})

const Employees = () => {
  const { user } = useAuth()
  const { t } = useTranslation()

  const employees = useFetchEmployeesByCompany(user?.company?.id)
  const agencies = useFetchAgenciesByCompany(user?.company?.id)

  return (
    <EmployeeContext.Provider value={{ employees, agencies }}>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl"> {t("ProviderEmployee.title")} </h1>
        <div className="self-start w-full max-w-xl">
          <ModalFormEmployee variant="outline" />
        </div>
        <DataTable isLoading={employees.isLoading} columns={columns} data={employees.data} />
      </div>
    </EmployeeContext.Provider>
  )
}

export default Employees
