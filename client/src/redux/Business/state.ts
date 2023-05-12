export interface BusinessState {
  storeList: Store[]
  todayOrders: TodayOrders[]
  latestOrders: LatestOrders[]
  editStoreInfo: StoreData | null
  options: {
    districts: { id: number; name: string }[]
  }
  selectedBranch: SelectedBranch
  powerbiToken: string
  errorMessage: string
}

export interface Store {
  id: number
  name: string
}

export interface SelectedBranch extends Store {
  openTimes: OpenTime[]
}

export interface OpenTime {
  id: number
  date: string
  startTime: string
  endTime: string
  isBook: boolean
}

export interface TodayOrders {
  id: number
  storeName: string
  clientName: string
  date: string
  startTime: string
}

export interface LatestOrders {
  id: number
  storeName: string
  clientName: string
  date: Date
  states: string
}

export interface StoreData {
  id: string
  name: string
  address: string
  districtId: string
  area: string
  maxPeople: string
  minPeople: string
  introduction: string
  image: string
  facilities: Array<{
    id: number
    name: string
    isAvailable: boolean
  }>
  facilitiesDetail: string
  importantMatter: string
  contactPerson: string
  contactNumber: string
  whatsapp: string
  email: string
}
