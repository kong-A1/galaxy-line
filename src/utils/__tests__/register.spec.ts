import { describe, expect, it } from 'vitest'

import { toApiBirthDate, toPersonalDetails } from '../register'

import type { RegisterFormValues } from '@/types/auth/auth.type'

const base: RegisterFormValues = {
  firstName: ' Somchai ',
  lastName: 'Jaidee',
  gender: 'unknown',
  nationality: '',
  citizenId: '',
  passportId: '',
  birthDate: '',
}

describe('toApiBirthDate', () => {
  it('turns dd/mm/yyyy into yyyy-mm-dd', () => {
    expect(toApiBirthDate('05/11/1990')).toBe('1990-11-05')
  })

  it('is empty for anything that is not a full date', () => {
    expect(toApiBirthDate('')).toBe('')
    expect(toApiBirthDate('05/11')).toBe('')
  })
})

describe('toPersonalDetails', () => {
  it('trims the names and leaves out optional fields that are empty', () => {
    expect(toPersonalDetails(base)).toEqual({
      first_name: 'Somchai',
      last_name: 'Jaidee',
      gender: 'unknown',
      nationality: '',
    })
  })

  it('sends the chosen nationality, ID and birth date', () => {
    expect(
      toPersonalDetails({
        ...base,
        gender: 'female',
        nationality: 'THA',
        citizenId: '1101700230673',
        birthDate: '05/11/1990',
      }),
    ).toEqual({
      first_name: 'Somchai',
      last_name: 'Jaidee',
      gender: 'female',
      nationality: 'THA',
      citizen_id: '1101700230673',
      date_of_birth: '1990-11-05',
    })
  })

  it('sends the passport for a foreign nationality', () => {
    expect(
      toPersonalDetails({ ...base, nationality: 'USA', passportId: 'AA1234567' }),
    ).toMatchObject({
      nationality: 'USA',
      passport_id: 'AA1234567',
    })
  })
})
