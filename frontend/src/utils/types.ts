export interface Company {
  id: number
  socialReason: string
  email: string
  siren: string
  phoneNumber: string
  description: string
  agencies: Agency[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
  image?: MediaObject
}

export interface Agency {
  "@id"?: string
  id: number
  name: string
  description?: string
  address: string
  city: string
  zip: string
  company: {
    id: number
    categories: Category[]
  }
  services: Service[]
  geoloc: [string, string]
  users?: Pick<Employee, "id" | "firstname" | "lastname">[]
  schedules: Schedule[]
  image?: MediaObject[]
}

export interface Category {
  id: number
  name: string
  services?: Service[]
}

export interface Service {
  "@id": string
  id: number
  name: string
  description?: string
  duration: number
  price: number
  category: Category
}

//TODO: cleanup types
export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  roles: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
  agencies?: Agency[]
  company?: Company
  instructorSessions?: Session[]
  image?: MediaObject
}

export interface Employee extends User {
  agencies?: Agency[]
  company?: Company
  instructorSessions: Session[]
  schedules: Schedule[]
}

export interface Session {
  id: number
  student: User
  instructor: User
  startDate: string
  endDate: string
  service: Service
  agency: Agency
  status: string
}

export interface Schedule {
  id: number
  date: string
  startHour: number
  endHour: number
  employee: Pick<Employee, "id" | "firstname" | "lastname">
}

export interface MediaObject {
  id: number
  contentUrl: string
}
