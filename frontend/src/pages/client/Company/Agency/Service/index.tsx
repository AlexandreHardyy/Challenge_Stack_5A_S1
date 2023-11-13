import { Service } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { computeServiceDuration } from "@/utils/helpers"
import Calendar from "./calendar"

function useFetchService(agencyId?: string, serviceId?: string) {
  const url = `${import.meta.env.VITE_API_URL}agencies/${agencyId}/services/${serviceId}`

  return useQuery<Service>(
    ["getService", url],
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Something went wrong with the request (getService)")
      }

      return response.json()
    },
    {
      retry: false,
    }
  )
}

export default function ServiceClient() {
  const { agencyId, serviceId } = useParams()

  const request = useFetchService(agencyId, serviceId)

  if (request.status === "error") {
    return <h1>WTFFFFF</h1>
  }

  return (
    <div className="flex flex-col gap-[50px] mt-[60px] mb-[83px]">
      <section className="w-[80%] mx-auto md:w-full md:mx-0">
        <div>
          <h1>Details</h1>
          <p>Title: {request.data?.name}</p>
          {request.data && <p>Duration: {computeServiceDuration(request.data.duration)}</p>}
          <p>Price: {request.data?.price}</p>
          {request.data?.description && <p>Descri: {request.data?.description}</p>}
        </div>
      </section>
      <section className="w-[80%] mx-auto md:w-full md:mx-0 flex justify-center">
        {request.data && <Calendar service={request.data} />}
      </section>
    </div>
  )
}
