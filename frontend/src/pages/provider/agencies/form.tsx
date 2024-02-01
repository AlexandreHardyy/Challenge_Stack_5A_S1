import { Agency } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useState } from "react"
import { useAddAgency, useUpdateAgency } from "@/services/agency.service"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SelectMultiple } from "@/components/select-multiple.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { AgencyContext } from "."
import { AgencyFormSchema, agencyFormSchema } from "@/zod-schemas/agency"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PencilIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const AgencyForm = ({ agency, isReadOnly }: { agency?: Agency; isReadOnly: boolean }) => {
  const { t } = useTranslation()
  const { services } = useContext(AgencyContext)
  const queryClient = useQueryClient()
  const addAgency = useAddAgency()
  const updateAgency = useUpdateAgency(agency?.id)
  const { user } = useAuth()

  const form = useForm<AgencyFormSchema>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      address: agency?.address ?? "",
      city: agency?.city ?? "",
      zip: agency?.zip ?? "",
      name: agency?.name ?? "",
      company: !agency ? `/api/companies/${user?.company?.id}` : undefined,
    },
  })

  const onSubmit = async (values: AgencyFormSchema) => {
    const result = await (!agency ? addAgency.mutateAsync(values) : updateAgency.mutateAsync(values))
    if (result.status === 201 || result.status === 200) {
      queryClient.invalidateQueries(["getAgencies"])
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ProviderAgencies.form.name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.name")} {...field} readOnly={isReadOnly} />
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
              <FormLabel>{t("ProviderAgencies.form.address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.address")} {...field} readOnly={isReadOnly} />
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
              <FormLabel>{t("ProviderAgencies.form.city")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.city")} {...field} readOnly={isReadOnly} />
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
              <FormLabel>{t("ProviderAgencies.form.zip")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ProviderAgencies.form.zip")} {...field} readOnly={isReadOnly} />
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
                <FormLabel>{t("ProviderAgencies.form.services")}</FormLabel>
                <FormControl>
                  <SelectMultiple
                    onChange={(ids) => form.setValue("services", ids)}
                    options={services?.map((service) => ({ value: service["@id"], label: service.name }))}
                    defaultData={agency?.services.map((service) => ({ value: service["@id"], label: service.name }))}
                    placeholder={t("ProviderAgencies.form.placeholders.services")}
                    disabled={isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        {!isReadOnly && (
          <Button type="submit">
            {agency ? t("ProviderAgencies.form.cta.update") : t("ProviderAgencies.form.cta.new")}
          </Button>
        )}
      </form>
    </Form>
  )
}

const ModalFormAgency = ({ agency, variant = "ghost" }: { agency?: Agency; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsReadOnly] = useState(!!agency)
  const { t } = useTranslation()
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!agency)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          {!agency ? t("ProviderAgencies.form.cta.new") : <PencilIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {!agency ? (
              t("ProviderAgencies.form.cta.new")
            ) : (
              <>
                Your agency
                {isReadOnly && (
                  <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                    <PencilIcon />
                  </Button>
                )}
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

export default ModalFormAgency
