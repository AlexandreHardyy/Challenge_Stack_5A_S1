import { Agency } from "@/utils/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import pictoAdresse from "@/assets/img/pictoAdresse.svg"
import { useTranslation } from "react-i18next"

function AgencyMarker({ agency, children }: { agency: Agency; children?: React.ReactNode }) {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={() => (window.location.href = `/companies/${agency.company.id}/agencies/${agency.id}`)}>
            <img src={pictoAdresse} width={40} alt="marker" />
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <p className="text-[24px] font-bold ">{agency.name}</p>
            <p>
              {t("searchClient.list.agencyCard.address")}: {agency.address}
            </p>
            <p>
              {t("searchClient.list.agencyCard.city")}: {agency.city}
            </p>
            <p>
              {t("searchClient.list.agencyCard.zip")}: {agency.zip}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default AgencyMarker
