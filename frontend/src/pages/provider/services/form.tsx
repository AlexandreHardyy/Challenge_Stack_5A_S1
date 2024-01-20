import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateService, useUpdateService } from "@/services"
import { useAddCategory, useUpdateCategory } from "@/services/category.service"
import { Category, Service } from "@/utils/types"
import { CategoryFormSchema, categoryFormSchema } from "@/zod-schemas/category"
import { ServiceFormSchema, serviceFormSchema } from "@/zod-schemas/service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { PencilIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

export const FormCategory = ({
  category,
  onSubmit,
}: {
  category?: Category
  onSubmit: (params: CategoryFormSchema) => void
}) => {
  const { t } = useTranslation()
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={
                    !category ? t("providerService.form.cta.newCategory") : t("providerService.form.cta.updateCategory")
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="px-6">
          {!category ? t("providerService.form.cta.newCategory") : t("providerService.form.cta.updateCategory")}
        </Button>
      </form>
    </Form>
  )
}

export const EditCategoryContainer = ({ category }: { category: Category }) => {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const updateCategory = useUpdateCategory(category.id)

  if (isEditing) {
    return (
      <FormCategory
        category={category}
        onSubmit={async (values) => {
          const result = await updateCategory.mutateAsync(values)

          if (result.status === 200) {
            queryClient.invalidateQueries({ queryKey: ["getCategories"] })
          }
          setIsEditing(false)
        }}
      />
    )
  }

  return (
    <>
      {category.name}
      <Button variant={"ghost"} className="px-2 text-primary">
        <PencilIcon onClick={() => setIsEditing(!isEditing)} />
      </Button>
    </>
  )
}

export const AddCategoryContainer = () => {
  const addCategory = useAddCategory(1)
  const queryClient = useQueryClient()

  return (
    <FormCategory
      onSubmit={async (values) => {
        const result = await addCategory.mutateAsync(values)

        if (result.status === 201) {
          queryClient.invalidateQueries({ queryKey: ["getCategories"] })
        }
      }}
    />
  )
}

export const ServiceForm = ({ service, categoryId }: { service?: Service; categoryId: number }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const form = useForm<ServiceFormSchema>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name ?? "",
      duration: String(service?.duration) ?? undefined,
      price: String(service?.price) ?? undefined,
      description: service?.description ?? "",
      category: `/api/categories/${categoryId}`,
    },
  })

  const createService = useCreateService()
  const updateService = useUpdateService(service?.id)

  const onSubmit = async (values: ServiceFormSchema) => {
    const res = await (!service ? createService.mutateAsync(values) : updateService.mutateAsync(values))
    if (res.status === 201 || res.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] })
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
              <FormLabel>{t("providerService.form.name")}</FormLabel>
              <FormControl>
                <Input placeholder={"Name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerService.form.price")} €</FormLabel>
              <FormControl>
                <Input placeholder={t("providerService.form.price")} {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerService.form.duration")} (min)</FormLabel>
              <FormControl>
                <Input placeholder={t("providerService.form.duration")} {...field} type="number" />
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
              <FormLabel>{t("providerService.form.description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("providerService.form.description")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {service ? t("providerService.form.cta.updateService") : t("providerService.form.cta.newService")}
        </Button>
      </form>
    </Form>
  )
}
