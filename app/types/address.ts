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

export interface AddressJsonld extends JsonLdResource, Address {}

export interface AddressJsonldSyliusAdminAddressShow
  extends JsonLdResource,
    AddressSyliusAdminAddressShow {}

export interface AddressJsonldSyliusAdminOrderIndex
  extends JsonLdResource,
    AddressSyliusAdminOrderIndex {}

export interface AddressJsonldSyliusAdminOrderShow
  extends JsonLdResource,
    AddressSyliusAdminOrderShow {}

export interface AddressJsonldSyliusShopAddressIndex
  extends JsonLdResource,
    AddressSyliusShopAddressIndex {}

export interface AddressJsonldSyliusShopAddressShow
  extends JsonLdResource,
    AddressSyliusShopAddressShow {}

export interface AddressJsonldSyliusShopCartShow
  extends JsonLdResource,
    AddressSyliusShopCartShow {}

export interface AddressJsonldSyliusShopOrderAccountShow
  extends JsonLdResource,
    AddressSyliusShopOrderAccountShow {}

export interface AddressInterface extends AddressAttributes {
  fullName?: string | null
  createdAt?: string
  updatedAt?: string | null
  id?: number
  customer?: string | null
}

export interface AddressInterfaceJsonld extends JsonLdResource, AddressInterface {}

export interface AddressLogEntry {
  action: string
  loggedAt: string
  version: number
  data: unknown
}

export interface AddressLogEntrySyliusAdminAddressLogEntryShow
  extends AddressLogEntry {}

export interface AddressLogEntryJsonldSyliusAdminAddressLogEntryShow
  extends JsonLdResource,
    AddressLogEntrySyliusAdminAddressLogEntryShow {}
