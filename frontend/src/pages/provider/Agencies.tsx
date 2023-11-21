import { DataTable } from "@/components/Table"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { Agency, Service } from "@/utils/types"
import { SelectMultiple } from "@/components/select-multiple"

const AGENCIES: Agency[] = []

const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "zip",
    header: "Zip code",
  },
  {
    accessorKey: "description",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "company",
    header: ({ column }) => column.toggleVisibility(false),
  },
  {
    accessorKey: "services",
    cell: ({ row }) => {
      const services = row.getValue("services") as Service[]
      return services.map((service) => service.name).join(", ")
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row: { getValue: val } }) => {
      return (
        <ModalFormAgency
          agency={{
            id: val("id"),
            address: val("address"),
            city: val("city"),
            zip: val("zip"),
            name: val("name"),
            description: val("description"),
            company: val("company"),
            services: val("services"),
            geoloc: val("geoloc"),
          }}
        />
      )
    },
  },
]

const SERVICES = [
  {
    value: "1",
    label: "permis 1h",
  },
  {
    value: "2",
    label: "permis 2h",
  },
  {
    value: "3",
    label: "code",
  },
]

const agencyFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  services: z.array(
    z
      .object({
        id: z.number(),
      })
      .required()
  ),
})

const AgencyForm = ({ agency, isReadOnly }: { agency?: Agency; isReadOnly: boolean }) => {
  const form = useForm<z.infer<typeof agencyFormSchema>>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      address: agency?.address ?? "",
      city: agency?.city ?? "",
      zip: agency?.zip ?? "",
      name: agency?.name ?? "",
    },
  })

  const onSubmit = (values: z.infer<typeof agencyFormSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip code</FormLabel>
              <FormControl>
                <Input placeholder="Zip" {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services"
          render={() => {
            return (
              <FormItem>
                <FormLabel>Services</FormLabel>
                <FormControl>
                  <SelectMultiple
                    onChange={(ids) =>
                      form.setValue(
                        "services",
                        ids.map((id) => ({ id: Number(id) }))
                      )
                    }
                    data={SERVICES}
                    placeholder="Select agency where the employee works..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        {!isReadOnly && <Button type="submit">{agency ? "Update agency" : "Add agency"}</Button>}
      </form>
    </Form>
  )
}

const ModalFormAgency = ({ agency, variant = "ghost" }: { agency?: Agency; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsreadOnly] = useState(!!agency)
  return (
    <Dialog onOpenChange={(open) => !open && setIsreadOnly(!!agency)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!agency ? "Add new agency" : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!agency ? (
              "Add new agency"
            ) : (
              <>
                Your agency{" "}
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsreadOnly(!isReadOnly)}>
                    {" "}
                    <PencilIcon />{" "}
                  </Button>
                )}{" "}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <AgencyForm agency={agency} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const Agencies = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl"> Your Agencies </h1>
      <div className="self-start w-full max-w-xl">
        <ModalFormAgency variant="outline" />
      </div>
      <DataTable columns={columns} data={AGENCIES} />
    </div>
  )
}

export default Agencies
