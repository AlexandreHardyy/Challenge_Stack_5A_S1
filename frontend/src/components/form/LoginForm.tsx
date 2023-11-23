import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/services/user/auth.service.ts"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const LoginForm = () => {
  const { setToken } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: (user: { email: string; password: string }) => {
      return login(user)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await loginMutation.mutateAsync(values)
      setToken(result.data.token)
      navigate("/", { replace: true })
    } catch (e) {
      form.setFocus("email")
    }
  }

  return (
    <>
      {loginMutation.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.form.error")} !</AlertTitle>
          <AlertDescription>{t("common.form.loginOrPassword")}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.form.password")}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loginMutation.isLoading} type="submit">
            {loginMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("header.cta.signIn")}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default LoginForm
