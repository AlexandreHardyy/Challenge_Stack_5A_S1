import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateUser } from "@/services/user/user.service.ts"
import { Alert, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertCircle, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

const formSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
})

const ProfileClient = () => {
  const { user } = useAuth()
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
    },
  })

  const updateProfile = useMutation({
    mutationFn: (newUser: { email: string; firstname: string; lastname: string }) => {
      return updateUser(user?.id ?? 0, newUser)
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email)
      form.setValue("firstname", user.firstname)
      form.setValue("lastname", user.lastname)
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProfile.mutateAsync(values)
    } catch (e) {
      form.setFocus("email")
    }
  }

  return (
    <div>
      <h1 className="px-6 text-3xl font-semibold">{t("header.cta.profile")}</h1>
      <div className="px-6 pt-4">
        {updateProfile.isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.form.error")} !</AlertTitle>
          </Alert>
        )}
      </div>
      <div className="px-6 pt-4">
        {updateProfile.isSuccess && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.validation.saveSuccess")} !</AlertTitle>
          </Alert>
        )}
      </div>
      <section className="w-full flex gap-4">
        <Avatar className="flex-1 flex justify-center">
          <AvatarImage src="https://github.com/shadcn.png" className="w-3/6 rounded" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 px-6 pt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
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
                    <Input {...field} type="text" />
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
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={updateProfile.isLoading} type="submit">
              {updateProfile.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.validation.saveProfile")}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

export default ProfileClient
