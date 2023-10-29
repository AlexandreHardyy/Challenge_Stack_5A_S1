export interface Company {
  id: number
  name: string
  email: string
  kbis: string
  phoneNumber: string
  description: string
  locations: Agency[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Agency {
  id: number
  name: string
  adresse: string
  city: string
  zip: string
}