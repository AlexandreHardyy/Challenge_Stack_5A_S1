import { Agency } from "@/utils/types.ts"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useUpdateAgency } from "@/services/agency.service"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { AgencyFormSchema } from "@/zod-schemas/agency"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, PencilIcon } from "lucide-react"
import { agencyAdminFormSchema } from "@/zod-schemas/agencyAdmin"

const AgencyForm = ({ agency, isReadOnly }: { agency: Agency; isReadOnly: boolean }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const updateAgency = useUpdateAgency(agency?.id)

  const form = useForm<AgencyFormSchema>({
    resolver: zodResolver(agencyAdminFormSchema),
    defaultValues: {
      address: agency.address,
      city: agency.city,
      zip: agency.zip,
      name: agency.name,
    },
  })

  const onSubmit = async (values: AgencyFormSchema) => {
    const result = await updateAgency.mutateAsync(values)
    if (result.status === 200) {
      queryClient.invalidateQueries(["getCompany"])
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
        {!isReadOnly && (
          <Button disabled={updateAgency.isLoading} type="submit">
            {updateAgency.isLoading && <Loader2 />}
            {t("ProviderAgencies.form.cta.update")}
          </Button>
        )}
      </form>
    </Form>
  )
}

const ModalFormAgency = ({ agency, variant = "ghost" }: { agency: Agency; variant?: "ghost" | "outline" }) => {
  const [isReadOnly, setIsReadOnly] = useState(true)
  return (
    <Dialog onOpenChange={(open) => !open && setIsReadOnly(!!agency)}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {isReadOnly && (
              <Button variant={"ghost"} onClick={() => setIsReadOnly(!isReadOnly)}>
                <PencilIcon />
              </Button>
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
