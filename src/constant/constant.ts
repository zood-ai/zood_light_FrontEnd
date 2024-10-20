interface Option {
  value: string
  label: string
}

export const userTypes = [
  {
    value: 'individual',
    label: 'individual',
  },
  {
    value: 'company',
    label: 'company',
  },
]
export const userStatus = [
  {
    value: 'active',
    label: 'active',
  },
  {
    value: 'inactive',
    label: 'inactive',
  },
  {
    value: 'deleted',
    label: 'deleted',
  },
]
export const userRoles = [
  {
    value: 'admin',
    label: 'admin',
  },
  {
    value: 'seller',
    label: 'seller',
  },
  {
    value: 'user',
    label: 'user',
  },
  {
    value: 'superadmin',
    label: 'super admin',
  },
]

export const gender = [
  {
    value: 'male',
    label: 'male',
  },
  {
    value: 'female',
    label: 'female',
  },
]
export const selectOptions: Option[] = [
  { value: 'NationalID', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'driverLicense', label: 'Driver License' },
]
