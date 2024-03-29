import { Agency } from "@/utils/types"
import { Link, useParams } from "react-router-dom"

export function AgencyList({ agencies }: { agencies?: Agency[] }) {
  const { companyId } = useParams()

  return (
    <div id="scroll-div" className="flex flex-col gap-[20px] w-[42%] h-[500px] overflow-scroll">
      {agencies?.map((agency) => {
        return (
          <div
            id={`agency-${agency.id}`}
            key={agency.id}
            className="flex gap-[15px] h-[159px] p-[20px] bg-background rounded-[8px] mr-[20px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
              <circle cx="35" cy="35" r="35" fill="#E4E4E7" />
            </svg>
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[20px] font-bold ">{agency.name}</h3>
              <div>
                <div className="flex gap-[5px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="23" viewBox="0 0 15 23" fill="none">
                    <path
                      d="M0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 8.67196 14.2124 9.77529 13.7043 10.7447L7.5 20.0956L1.29569 10.7447C0.787611 9.77529 0.5 8.67196 0.5 7.5Z"
                      stroke="#333333"
                    />
                    <circle cx="7.5" cy="7.5" r="3" stroke="#333333" />
                  </svg>
                  <p className="underline">
                    {agency.address}, {agency.zip} {agency.city}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p>2,5</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path
                      d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                      fill="#1AB34C"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path
                      d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                      fill="#1AB34C"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path
                      d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                      fill="#1AB34C"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path
                      d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                      fill="#E4E4E7"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                    <path
                      d="M7.57668 0.719928C7.91827 -0.101364 9.08173 -0.101364 9.42332 0.719928L10.7782 3.97749C10.9222 4.32373 11.2478 4.5603 11.6216 4.59026L15.1384 4.8722C16.0251 4.94329 16.3846 6.04979 15.7091 6.62846L13.0296 8.92369C12.7449 9.16764 12.6205 9.55042 12.7075 9.91518L13.5261 13.347C13.7325 14.2122 12.7912 14.8961 12.0321 14.4324L9.02125 12.5934C8.70124 12.3979 8.29876 12.3979 7.97875 12.5934L4.96786 14.4324C4.20876 14.8961 3.26751 14.2122 3.4739 13.347L4.29251 9.91517C4.37952 9.55042 4.25515 9.16764 3.97036 8.92369L1.29092 6.62846C0.615382 6.04979 0.974908 4.94329 1.86156 4.8722L5.37838 4.59026C5.75217 4.5603 6.07778 4.32373 6.22178 3.97749L7.57668 0.719928Z"
                      fill="#E4E4E7"
                    />
                  </svg>
                  <p>(54 avis)</p>
                </div>
              </div>
              <p className="font-semibold underline">
                <Link to={`/companies/${companyId}/agencies/${agency.id}`}>Consulter la page</Link>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
