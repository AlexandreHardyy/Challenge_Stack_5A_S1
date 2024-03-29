import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useEffect, useState } from "react"
import { useSearchFiltersContext } from "./search-filters-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

const searchFormSchema = z.object({
  name: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  address: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  zip: z.string().max(50).optional(),
  page: z.string(),
})

function SearchForm() {
  const { t } = useTranslation()

  const { filters, setFilters } = useSearchFiltersContext()
  const [enabledInputs, setEnabledInputs] = useState<string[]>([])

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
  })

  function onEnabledInputsChange(value: string[]) {
    if (value.length <= enabledInputs.length) {
      const newFilters = { ...filters }
      if (!value.includes("category")) {
        delete newFilters.category
      }
      if (!value.includes("location")) {
        delete newFilters.address
        delete newFilters.city
        delete newFilters.zip
      }

      setFilters(newFilters)
    }

    setEnabledInputs(value)
  }

  useEffect(() => {
    if (filters.category) {
      if (!enabledInputs.includes("category")) {
        setEnabledInputs([...enabledInputs, "category"])
      }
      form.setValue("category", filters.category)
    }
  }, [filters])

  return (
    <Card className="">
      <CardHeader>
        <ToggleGroup value={enabledInputs} onValueChange={onEnabledInputsChange} variant="outline" type="multiple">
          <ToggleGroupItem className="data-[state=on]:text-primary" value="category" aria-label="Toggle bold">
            {t("searchClient.form.categoryToggle")}
          </ToggleGroupItem>
          <ToggleGroupItem className="data-[state=on]:text-primary" value="location" aria-label="Toggle italic">
            {t("searchClient.form.locationToggle")}
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setFilters)} className="space-y-8">
            <div className="flex w-full gap-2">
              <FormField
                control={form.control}
                defaultValue=""
                name="name"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>{t("searchClient.form.nameInput")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("searchClient.form.nameInputPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                defaultValue={"1"}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {enabledInputs.includes("category") && (
              <FormField
                control={form.control}
                defaultValue=""
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("searchClient.form.categoryInput")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("searchClient.form.categoryInputPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {enabledInputs.includes("location") && (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  defaultValue=""
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("searchClient.form.addressInput")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("searchClient.form.addressInputPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  defaultValue=""
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("searchClient.form.cityInput")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("searchClient.form.cityInputPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  defaultValue=""
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("searchClient.form.zipInput")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("searchClient.form.zipInputPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button type="submit">{t("searchClient.form.submitInput")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SearchForm
