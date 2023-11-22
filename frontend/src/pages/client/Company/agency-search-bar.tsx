import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Agency } from "@/utils/types"
import { useTranslation } from "react-i18next"

const FormSchema = z.object({
  agencySearch: z.string(),
})

interface AgencySearchBarprops {
  agencies: Agency[]
  setFilteredAgencies: (agencies?: Agency[]) => void
}

export default function AgencySearchBar({ agencies, setFilteredAgencies }: AgencySearchBarprops) {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      agencySearch: "",
    },
  })

  function onSubmitResearch(data: z.infer<typeof FormSchema>) {
    const agencySearch = data.agencySearch.toLowerCase()
    if (agencies) {
      if (agencySearch !== "") {
        setFilteredAgencies(
          agencies.filter((agency) => {
            return (
              agency.address.toLowerCase().includes(agencySearch) ||
              agency.city.toLowerCase().includes(agencySearch) ||
              agency.name.toLowerCase().includes(agencySearch) ||
              agency.zip.toLowerCase().includes(agencySearch)
            )
          })
        )
      } else {
        setFilteredAgencies(undefined)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitResearch)} className="flex gap-[20px]">
        <FormField
          control={form.control}
          name="agencySearch"
          render={({ field }) => (
            <FormItem className="w-[42%]">
              <FormControl>
                <Input
                  placeholder={t("companyClient.section2.searchBarPlaceholder")}
                  className="h-[40px] border-grey-dark p-[9px] rounded-[8px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-primary">{t("companyClient.section2.researchCta")}</Button>
      </form>
    </Form>
  )
}
