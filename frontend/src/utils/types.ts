export interface Company {
  id: number
  name: string
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

export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
}
