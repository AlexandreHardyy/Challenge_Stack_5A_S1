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
  users?: Pick<User, "id" | "firstname" | "lastname">[]
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

export interface Employee {
  id: number
  email: string
  firstname: string
  lastname: string
  agencies: Agency[] | undefined
}

export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  roles: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
  agencies?: Agency[]
}

export interface Session {
  student: User
  instructor: User
  startDate: string
  endDate: string
  service: Service
  Agency: Agency
  status: string
}
