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

/**
 * Verify if the siren is valid
 * @param siren
 */
const verifySiren = async (siren: string) => {
  const token = import.meta.env.VITE_NEXT_PUBLIC_API_ENTREPRISE_TOKEN
  // const apiUrlProd = `https://entreprise.api.gouv.fr/v3/infogreffe/rcs/unites_legales/${siren}/extrait_kbis`;
  const apiUrlStaging = `https://staging.entreprise.api.gouv.fr/v3/infogreffe/rcs/unites_legales/${siren}/extrait_kbis`

  try {
    const response = await fetch(apiUrlStaging, {
      // mode: 'no-cors',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Access-Control-Allow-Origin': '*',
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
    return true //TODO: change to false when api is working
  }
}

const NewProvider = () => {
  const { toast } = useToast()
  const { t } = useTranslation()

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
    isVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roles: z.array(z.string()),
  })

  const form = useForm<z.infer<typeof newProviderFormSchema>>({
    resolver: zodResolver(newProviderFormSchema),
    defaultValues: {
      phoneNumber: "",
      socialReason: "",
      description: "",
      siren: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstname: "",
      lastname: "",
      email: "",
      isVerified: false,
      roles: ["PROVIDER", "NOT_VERIFIED"],
    },
  })

  const onSubmit = async (values: z.infer<typeof newProviderFormSchema>) => {
    console.log(values)
    //regarder dans son powerpoint, le denormalizerContext slide 52 pour rendre unique le nom de la société et ne pas ajouter si jamais
    const companiesUrlApi = `${import.meta.env.VITE_API_URL}companies`
    const usersUrlApi = `${import.meta.env.VITE_API_URL}users`
    //envoyer les données au back et créer un provider en bdd via la route /api/companies en post
    try {
      const companyResponse = await fetch(companiesUrlApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (companyResponse.status === 201) {
        const userResponse = await fetch(usersUrlApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (userResponse.status === 201) {
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
    } catch (error) {
      console.error(error)
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
          <Button type="submit">{t("newProvider.form.cta.submit")}</Button>
        </form>
      </Form>
      <img src={newProviderUndraw} className="w-1/2" alt="image new provider" />
    </section>
  )
}

export default NewProvider
