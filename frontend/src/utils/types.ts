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
  users: Pick<Employee, "id" | "firstname" | "lastname" | "email">[]
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
    socialReason: string
    categories: Category[]
  }
  services: Service[]
  geoloc: [string, string]
  users?: Pick<Employee, "id" | "firstname" | "lastname" | "image" | "email">[]
  schedules: Schedule[]
  sessions: Session[]
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
  image?: MediaObject
}

export interface Student extends User {
  studentMarks?: number
  studentSessions?: Session[]
}

export interface Employee extends User {
  agencies?: Agency[]
  company?: Company
  instructorSessions?: Session[]
  schedules: Schedule[]
}

export interface Session {
  "@id": string
  id: number
  student: Student
  instructor: User
  startDate: string
  endDate: string
  service: Service
  agency: Agency
  status: string
  studentMark?: number
  ratingService?: RatingService
  feedBack: FeedBack
}

export interface Schedule {
  id: number
  date: string
  startHour: number
  endHour: number
  employee: Pick<Employee, "id" | "firstname" | "lastname">
  scheduleExceptions: ScheduleException[]
}

export interface ScheduleException {
  firstname?: string
  lastname?: string
  date?: Date
  id: number
  startHour: number
  endHour: number
  status: string
}

export interface RatingService {
  id: number
  rating: number
  comment: string
  session: Session
  user: User
}

export interface MediaObject {
  "@id": string
  id: number
  contentUrl: string
}

export interface FeedBackGroup {
  question: string
  answer: string
}
export interface FeedBack {
  id: number
  feedBackGroups: FeedBackGroup[]
}
export interface FeedBackBuilder {
  id: number
  title: string
  isSelected?: boolean
  questions: string[]
}

export interface ScheduleDisponibilties {
  date: string
  startHour: number
  endHour: number
  scheduleExceptions: {
    startHour: number
    endHour: number
  }[]
}

export interface Disponibility {
  userId: number
  sessions: Pick<Session, "id" | "startDate" | "endDate">[]
  schedules: ScheduleDisponibilties[]
}
