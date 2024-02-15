import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import newProviderUndraw from "@/assets/img/newProviderUndraw.svg"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAddCompany } from "@/services/company.service"
import { addNewProvider } from "@/services/user/auth.service"
import { Loader2 } from "lucide-react"

/**
 * Verify if the siren is valid
 * @param siren
 */
const verifySiren = async (siren: string) => {
  const token = import.meta.env.VITE_NEXT_PUBLIC_API_ENTREPRISE_TOKEN
  const apiUrlStagingVerifySiren = `https://staging.entreprise.api.gouv.fr/v3/infogreffe/rcs/unites_legales/${siren}/extrait_kbis`

  try {
    const response = await fetch(apiUrlStagingVerifySiren, {
      headers: {
        cors: "no-cors",
        Authorization: `Bearer ${token}`,
        AccessControlAllowOrigin: "*",
      },
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error)
      return false
    }
    return Promise.resolve(data)
  } catch (err) {
    console.error(err)
    return true
  }
}

const NewProvider = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  const addCompany = useAddCompany()

  const newProviderFormSchema = z.object({
    firstname: z.string().min(2, {
      message: t("newProvider.form.errors.firstName"),
    }),
    lastname: z.string().min(2, {
      message: t("newProvider.form.errors.lastName"),
    }),
    email: z.string().email(),
    phoneNumber: z.string().regex(/^(\+33|0)[1-9]([-. ]?\d{2}){4}$/, {
      message: t("newProvider.form.errors.phoneNumber"),
    }),
    socialReason: z.string().min(2, {
      message: t("newProvider.form.errors.socialReason"),
    }),
    description: z.string().min(2, {
      message: t("newProvider.form.errors.description"),
    }),
    siren: z
      .string()
      .regex(/^\d{9}$/, {
        message: t("newProvider.form.errors.sirenNumberRegExp"),
      })
      .refine(
        async (siren) => {
          return await verifySiren(siren)
        },
        {
          message: t("newProvider.form.errors.sirenNumberNotValid"),
        }
      ),
    createdAt: z.string(),
    updatedAt: z.string(),
  })

  const form = useForm<z.infer<typeof newProviderFormSchema>>({
    resolver: zodResolver(newProviderFormSchema),
    defaultValues: {
      phoneNumber: "",
      socialReason: "",
      description: "",
      siren: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      firstname: "",
      lastname: "",
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof newProviderFormSchema>) => {
    const createCompanyRequest = await addCompany.mutateAsync(values)

    if (createCompanyRequest.status === 201) {
      const lastInsertCompanyId: number = createCompanyRequest.data.id
      const addNewProviderRequest = await addNewProvider(values, lastInsertCompanyId)
      if (addNewProviderRequest.status === 201) {
        toast({
          variant: "success",
          title: t("newProvider.form.toast.successTitle"),
          description: t("newProvider.form.toast.success"),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("newProvider.form.toast.errorTitle"),
          description: t("newProvider.form.toast.error"),
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: t("newProvider.form.toast.errorTitle"),
        description: t("newProvider.form.toast.error"),
      })
    }
  }

  return (
    <section className="flex justify-between gap-16 my-14 px-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-1/4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newProvider.form.firstName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("newProvider.form.placeholders.firstName")} {...field} />
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
                <FormLabel>{t("newProvider.form.lastName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("newProvider.form.placeholders.lastName")} {...field} />
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
                <FormLabel>{t("newProvider.form.email")}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("newProvider.form.placeholders.email")} {...field} />
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
                <FormLabel>{t("newProvider.form.phoneNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("newProvider.form.placeholders.phoneNumber")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newProvider.form.socialReason")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("newProvider.form.placeholders.socialReason")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newProvider.form.description")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("newProvider.form.placeholders.description")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="siren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newProvider.form.sirenNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("newProvider.form.placeholders.sirenNumber")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={addCompany.isLoading} type="submit">
            {addCompany.isLoading && <Loader2 />}
            {t("newProvider.form.cta.submit")}
          </Button>
        </form>
      </Form>
      <img src={newProviderUndraw} className="w-1/2" alt="image new provider" />
    </section>
  )
}

export default NewProvider
