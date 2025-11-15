export type JsonLdContext = string | Record<string, unknown>

export interface JsonLdResource {
  '@context'?: JsonLdContext
  '@id'?: string
  '@type'?: string
}

export interface AddressAttributes {
  firstName: string
  lastName: string
  phoneNumber?: string | null
  company?: string | null
  countryCode: string
  provinceCode?: string | null
  provinceName?: string | null
  street: string
  city: string
  postcode: string
}

export interface Address extends AddressAttributes {
  customer?: string | null
  id?: number
  createdAt?: string
  updatedAt?: string | null
  fullName?: string
}

export interface AddressSyliusAdminAddressShow extends AddressAttributes {
  id?: number
}

export type AddressSyliusAdminAddressUpdate = AddressAttributes

export type AddressSyliusAdminOrderIndex = AddressAttributes

export type AddressSyliusAdminOrderShow = AddressAttributes

export type AddressSyliusShopAddressCreate = AddressAttributes

export interface AddressSyliusShopAddressIndex extends AddressAttributes {
  id?: number
}

export interface AddressSyliusShopAddressShow extends AddressAttributes {
  id?: number
}

export type AddressSyliusShopAddressUpdate = AddressAttributes

export type AddressSyliusShopCartShow = AddressAttributes

export type AddressSyliusShopOrderAccountShow = AddressAttributes

export type AddressJsonld = JsonLdResource & Address

export type AddressJsonldSyliusAdminAddressShow =
  JsonLdResource & AddressSyliusAdminAddressShow

export type AddressJsonldSyliusAdminOrderIndex =
  JsonLdResource & AddressSyliusAdminOrderIndex

export type AddressJsonldSyliusAdminOrderShow =
  JsonLdResource & AddressSyliusAdminOrderShow

export type AddressJsonldSyliusShopAddressIndex =
  JsonLdResource & AddressSyliusShopAddressIndex

export type AddressJsonldSyliusShopAddressShow =
  JsonLdResource & AddressSyliusShopAddressShow

export type AddressJsonldSyliusShopCartShow =
  JsonLdResource & AddressSyliusShopCartShow

export type AddressJsonldSyliusShopOrderAccountShow =
  JsonLdResource & AddressSyliusShopOrderAccountShow

export interface AddressInterface extends AddressAttributes {
  fullName?: string | null
  createdAt?: string
  updatedAt?: string | null
  id?: number
  customer?: string | null
}

export type AddressInterfaceJsonld = JsonLdResource & AddressInterface

export interface AddressLogEntry {
  action: string
  loggedAt: string
  version: number
  data: unknown
}

export type AddressLogEntrySyliusAdminAddressLogEntryShow = AddressLogEntry

export type AddressLogEntryJsonldSyliusAdminAddressLogEntryShow =
  JsonLdResource & AddressLogEntrySyliusAdminAddressLogEntryShow
