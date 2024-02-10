import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "@/services/user/auth.service.ts"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast.ts"

const ForgotPasswordForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const formSchema = z.object({
    email: z.string().email(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return forgotPassword(email)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await forgotPasswordMutation.mutateAsync(values)
      toast({
        variant: "success",
        title: t("Un email de réinitialisation de mot de passe a été envoyé."),
      })
      navigate("/login", { replace: true })
    } catch (e) {
      toast({
        variant: "destructive",
        title: t("common.form.error"),
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
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">{t("common.form.sendMeEmail")}</Button>
        </div>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
