import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Link, useNavigate } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { register } from "@/services/user/auth.service.ts"

const formSchema = z
  .object({
    firstname: z.string().trim().min(2),
    lastname: z.string().trim().min(2),
    email: z.string().email(),
    phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, "Must be a valid phone number with the format +33"),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Must contain at least one letter and one number"),
    passwordConfirmation: z.string(),
    cgu: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "passwords must match",
    path: ["passwordConfirmation"],
  })
  .refine((data) => data.cgu, {
    message: "You must accept the CGU",
    path: ["cgu"],
  })

const RegisterForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      password: "",
      passwordConfirmation: "",
      cgu: false,
    },
  })

  const registerMutation = useMutation({
    mutationFn: (user: {
      firstname: string
      lastname: string
      email: string
      phoneNumber: string
      plainPassword: string
    }) => {
      return register(user)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerMutation.mutateAsync({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        plainPassword: values.password,
      })
      navigate("/auth/register/welcome")
    } catch (e) {
      form.setFocus("firstname")
    }
  }

  return (
    <>
      {registerMutation.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.form.error")} !</AlertTitle>
          <AlertDescription>{t("common.form.errorAccountCreation")}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className={"flex gap-3"}>
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormLabel>{t("common.form.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="given-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormLabel>{t("common.form.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="family-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.form.email")}</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
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
                  <Input {...field} type="text" autoComplete="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={"flex gap-3"}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormLabel>{t("common.form.password")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormLabel>{t("common.form.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="cgu"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    By checking this box, you accept the{" "}
                    <Link className="text-primary" to="/terms">
                      terms and conditions
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button disabled={registerMutation.isLoading} type="submit" className={"w-full"}>
            {registerMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.cta.createMyAccount")}
          </Button>
          <Button variant={"secondary"} disabled={registerMutation.isLoading} className={"w-full"} asChild>
            <Link to={"/auth/login"}> {t("common.form.haveAccount")}</Link>
          </Button>
        </form>
      </Form>
    </>
  )
}

export default RegisterForm
