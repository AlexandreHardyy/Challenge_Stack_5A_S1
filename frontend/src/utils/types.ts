export interface Company {
  id: number
  name: string
  email: string
  kbis: string
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
}

export interface Category {
  id: number
  name: string
}

export interface Service {
  id: number
  name: string
  description?: string
  duration: number
  price: number
  category: Category
}
