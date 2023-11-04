import { DataTable } from "@/components/Table"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { ColumnDef } from "@tanstack/react-table"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { SelectMultiple } from "@/components/select-multiple"


type Employee = {
    id: string
    firstname: string
    lastname: string
    email: string
    phone: string
    agencies?: string[]
}

const AGENCIES = [
  {
    value: "paris",
    label: "Paris",
  },
  {
    value: "marseille",
    label: "Marseille",
  },
  {
    value: "chatou",
    label: "Chatou",
  }
]
   
const employees: Employee[] = [
  {
      id: "728ed52f",
      firstname: "noe",
      lastname: "pigeau",
      email: "noepigeau@gmail.com",
      phone: "0712121212"
  },
  {
      id: "728ed52f",
      firstname: "noe",
      lastname: "pigeau",
      email: "noepigeau@gmail.com",
      phone: "0712121212"
  },
  {
      id: "728ed52f",
      firstname: "noe",
      lastname: "pigeau",
      email: "noepigeau@gmail.com",
      phone: "0712121212"
  },
  {
      id: "728ed52f",
      firstname: "noe",
      lastname: "pigeau",
      email: "noepigeau@gmail.com",
      phone: "0712121212"
  }
]

const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => column.toggleVisibility(false)
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
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row: { getValue: val } }) => {
        return <ModalFormEmployee employee={{
          id: val('id'),
          email: val('email'),
          firstname: val('firstname'),
          lastname: val('lastname'),
          phone: val('phone')
        }} />
      }
    }
]

const employeeFormSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(2, {
    message: "FirstName must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "FirstName must be at least 2 characters.",
  }),
  phone: z.string(),
  agencies: z.array(z.string())
})

const EmployeeForm = ({ employee, isReadOnly }: { employee?: Employee, isReadOnly: boolean }) => {
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: employee?.email ?? "",
      firstname: employee?.firstname ?? "",
      lastname: employee?.lastname ?? "",
      phone: employee?.phone ?? "",
      agencies: employee?.agencies ?? []
    }
  })

  const onSubmit = (values: z.infer<typeof employeeFormSchema>) => {
      console.log(values)
  }

  return (
    <Form {...form} >
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Phone" {...field} readOnly={isReadOnly} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="agencies"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Agencies</FormLabel>
              <FormControl>
                <SelectMultiple onChange={(values) => form.setValue('agencies', values)} data={AGENCIES} placeholder="Select agency where the employee works..."/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      {!isReadOnly && <Button type="submit">{employee ? "Update employee" : "Add employee"}</Button>}
      </form>
  </Form>
  )
}

const ModalFormEmployee = ({ employee, variant = 'ghost' } : { employee?: Employee,  variant?: 'ghost' | 'outline' }) => {
  const [ isReadOnly, setIsreadOnly ] = useState(!!employee)
  return (
    <Dialog onOpenChange={(open) => !open && setIsreadOnly(!!employee)}>
      <DialogTrigger asChild><Button variant={variant} className="px-2">{!employee ? "Add new employee": <PencilIcon />}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">{!employee ? "Add new employee": <>Your employee {isReadOnly && <Button variant={"ghost"} onClick={() => setIsreadOnly(!isReadOnly)} > <PencilIcon /> </Button>} </>}</DialogTitle>
          <DialogDescription>
            <EmployeeForm employee={employee} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const Employees = () => {
    return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl"> Your Employees </h1>
        <div className="self-start w-full max-w-xl">
            <ModalFormEmployee variant="outline" />
        </div>
        <DataTable columns={columns} data={employees} />
      </div>
  )
}

export default Employees