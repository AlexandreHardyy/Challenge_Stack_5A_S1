import { DataTable } from "@/components/Table"
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
import { addNewEmployee, updateEmployeeById, useFetchEmployeesByCompany } from "@/services/user/user.service"
import { Agency, Employee, User } from "@/utils/types"
import { useFetchAgenciesByCompany } from "@/services/agency.service"
import { UseQueryResult } from "@tanstack/react-query"
import { Spinner } from "@/components/loader/Spinner"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone number",
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
    cell: ({ row: { getValue: val } }) => {
      return (
        <div className="flex items-center gap-4">
          <ModalFormEmployee
            // WTFF is that ???
            employee={{
              id: val("id"),
              email: val("email"),
              firstname: val("firstname"),
              lastname: val("lastname"),
              phoneNumber: val("phoneNumber"),
              agencies: val("agencies"),
            }}
          />
          <Link to={`/provider/employee/${val("id")}`}>
            {" "}
            <EyeIcon />{" "}
          </Link>
        </div>
      )
    },
  },
]

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
        title: t("ProviderAgencies.form.toast.title"),
        description: t("ProviderAgencies.form.toast.successCreate"),
      })
      employees?.refetch()
    } else if (result.status === 200) {
      toast({
        variant: "success",
        title: t("ProviderAgencies.form.toast.title"),
        description: t("ProviderAgencies.form.toast.successUpdate"),
      })
      employees?.refetch()
    } else {
      toast({
        variant: "destructive",
        title: t("ProviderAgencies.form.toast.title"),
        description: t("ProviderAgencies.form.toast.error"),
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
              <FormLabel>Email</FormLabel>
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
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} readOnly={isReadOnly} />
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
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} readOnly={isReadOnly} />
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
              <FormLabel>Phone number</FormLabel>
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
                  <FormLabel>Agencies</FormLabel>
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

        {!isReadOnly && <Button type="submit">{employee ? "Update employee" : "Add employee"}</Button>}
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
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!employee)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!employee ? "Add new employee" : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!employee ? (
              "Add new employee"
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

  const employees = useFetchEmployeesByCompany(user?.company?.id)
  const agencies = useFetchAgenciesByCompany(user?.company?.id)

  return (
    <EmployeeContext.Provider value={{ employees, agencies }}>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl"> Your Employees </h1>
        <div className="self-start w-full max-w-xl">
          <ModalFormEmployee variant="outline" />
        </div>
        <DataTable isLoading={employees.isLoading} columns={columns} data={employees.data} />
      </div>
    </EmployeeContext.Provider>
  )
}

export default Employees
