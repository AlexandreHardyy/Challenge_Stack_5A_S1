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
import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { addNewUser, updateUserById, useFetchUsers } from "@/services"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { User } from "@/utils/types.ts"
import { formatDate } from "@/utils/helpers.ts"
import { SelectMultiple } from "@/components/select-multiple.tsx"
import { Spinner } from "@/components/loader/Spinner.tsx"
import { toast } from "@/components/ui/use-toast.ts"
import { t, TFunction } from "i18next"
import { useTranslation } from "react-i18next"

function usersColumns(t: TFunction<"translation", undefined>): ColumnDef<User>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => column.toggleVisibility(false),
    },
    {
      accessorKey: "firstname",
      header: t("admin.users.table.firstName"),
    },
    {
      accessorKey: "lastname",
      header: t("admin.users.table.lastName"),
    },
    {
      accessorKey: "email",
      header: t("admin.users.table.email"),
    },
    {
      accessorKey: "roles",
      header: t("admin.users.table.roles"),
    },
    {
      accessorKey: "isVerified",
      header: t("admin.users.table.isVerified"),
    },
    {
      accessorKey: "createdAt",
      header: t("admin.users.table.createdAt"),
    },
    {
      accessorKey: "updatedAt",
      header: t("admin.users.table.updatedAt"),
    },
    {
      accessorKey: "actions",
      header: t("admin.users.table.actions"),
      cell: ({ row: { getValue: val } }) => {
        return (
          <ModalFormUser
            user={{
              id: val("id"),
              firstname: val("firstname"),
              lastname: val("lastname"),
              email: val("email"),
              roles: val("roles"),
              isVerified: val("isVerified"),
              createdAt: val("createdAt"),
              updatedAt: val("updatedAt"),
            }}
          />
        )
      },
    },
  ]
}

const userFormSchema = z.object({
  firstname: z.string().min(2, {
    message: t("admin.users.table.errors.firstName"),
  }),
  lastname: z.string().min(2, {
    message: t("admin.users.table.errors.lastName"),
  }),
  email: z.string().email(),
  roles: z.array(z.string()),
  isVerified: z.boolean(),
  updatedAt: z.string(),
})

const UserForm = ({ user, isReadOnly }: { user?: User; isReadOnly: boolean }) => {
  const users = useFetchUsers()
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      roles: user?.roles ?? [],
      isVerified: user?.isVerified ?? false,
      updatedAt: user?.updatedAt ?? new Date().toISOString(),
    },
  })

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    const result = await (!user ? addNewUser(values) : updateUserById(user!.id, values))
    if (result.status === 201) {
      toast({
        variant: "success",
        title: t("admin.users.toast.success.title"),
        description: t("admin.users.toast.success.create"),
      })
      users?.refetch()
    } else if (result.status === 200) {
      toast({
        variant: "success",
        title: t("admin.users.toast.update.title"),
        description: t("admin.users.toast.update.update"),
      })
      users?.refetch()
    } else {
      toast({
        variant: "destructive",
        title: t("admin.users.toast.error.title"),
        description: t("admin.users.toast.error.error"),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.users.table.firstName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.users.table.firstName")} {...field} readOnly={isReadOnly} />
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
              <FormLabel>{t("admin.users.table.lastName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.users.table.lastName")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.users.table.email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.users.table.email")} {...field} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {user && (
          <FormField
            control={form.control}
            name="roles"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>{t("admin.users.table.roles")}</FormLabel>
                  <FormControl>
                    <SelectMultiple
                      onChange={(values) => form.setValue("roles", values)}
                      options={user.roles.map((role) => ({ value: role ?? "", label: role }))}
                      defaultData={user?.roles?.map((role) => ({
                        value: role,
                        label: role,
                      }))}
                      placeholder={t("admin.users.table.placeholder.roles")}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}
        <FormField
          control={form.control}
          name="isVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormLabel>{t("admin.users.table.isVerifiedLabel")}</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isReadOnly && <Button type="submit">{user ? t("admin.users.cta.edit") : t("admin.users.cta.add")}</Button>}
      </form>
    </Form>
  )
}

const ModalFormUser = ({ user, variant = "ghost" }: { user?: User; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsReadOnly] = useState(!!user)
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!user)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!user ? t("admin.users.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!user ? (
              t("admin.users.cta.new")
            ) : (
              <>
                <div className="flex items-center">
                  <h2>{t("admin.users.table.user")}</h2>
                  {isReadOnly && (
                    <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                      <PencilIcon />
                    </Button>
                  )}{" "}
                </div>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            <UserForm user={user} isReadOnly={isReadOnly} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const Users = () => {
  const { t } = useTranslation()
  const usersRequest = useFetchUsers()

  if (usersRequest.status === "error") {
    return <div>{t("common.form.fetchingError")}</div>
  }

  if (usersRequest.isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    )
  }

  const users: User[] = usersRequest.data

  const formattedUsers: User[] = users.map((user: User) => ({
    ...user,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  }))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">{t("admin.users.title")}</h1>
      <div className="self-start w-full max-w-xl">
        <ModalFormUser variant="outline" />
      </div>
      <DataTable isLoading={usersRequest.isLoading} columns={usersColumns(t)} data={formattedUsers} />
    </div>
  )
}

export default Users
