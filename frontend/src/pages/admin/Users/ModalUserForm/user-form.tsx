import { User } from "@/utils/types.ts"
import { addNewUser, updateUserById, useFetchUsers } from "@/services"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast.ts"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SelectMultiple } from "@/components/select-multiple.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Button } from "@/components/ui/button.tsx"
import { t } from "i18next"

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

export default function UserForm({
  user,
  isReadOnly,
}: {
  user?: Pick<User, "id" | "firstname" | "lastname" | "email" | "roles" | "isVerified" | "createdAt" | "updatedAt">
  isReadOnly: boolean
}) {
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
    console.log(values)
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
                      placeholder={t("admin.users.table.placeholders.roles")}
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
