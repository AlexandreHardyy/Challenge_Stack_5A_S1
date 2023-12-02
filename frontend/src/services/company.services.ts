import { useQuery } from "@tanstack/react-query"
import { Company } from "@/utils/types.ts"
import api from "@/utils/api.ts"
import { toast } from "@/components/ui/use-toast.ts"
import { t } from "i18next"

export function useFetchCompany(companyId?: string) {
  const fetchCompanyUrl = `${import.meta.env.VITE_API_URL}companies/${companyId}`

  return useQuery<Company>(
    ["getCompany", fetchCompanyUrl],
    async () => {
      const response = await api.get(fetchCompanyUrl)
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: t("admin.homeProvider.toast.error"),
        })
      }
      return response.data
    },
    {
      retry: false,
    }
  )
}
