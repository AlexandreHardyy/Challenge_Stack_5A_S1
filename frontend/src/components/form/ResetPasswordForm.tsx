import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/services/user/auth.service.ts"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast.ts"

const ResetPasswordForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { token } = useParams()

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Must contain at least one letter and one number"),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "passwords must match",
      path: ["passwordConfirmation"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ password }: { password: string }) => {
      return resetPassword(token ?? "", password)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await resetPasswordMutation.mutateAsync(values)
      toast({
        variant: "success",
        title: t("common.form.passwordResetSuccess"),
      })
      navigate("auth/login", { replace: true })
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
          name="password"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>{t("common.form.confirmPassword")}</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">{t("common.form.ResetMyPassword")}</Button>
        </div>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
