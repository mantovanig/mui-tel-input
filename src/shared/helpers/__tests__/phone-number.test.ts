import { Country } from '@shared/constants/countries'
import { ISO_3166_ALPHA_2_MAPPINGS } from '@shared/constants/iso'
import { expect } from 'vitest'

import {
  applyMaskToInputValue,
  buildValue,
  getCallingCode,
  matchIsValidCallingCode,
  matchStartsWithCallingCode
} from '../phone-number'

import '@testing-library/jest-dom'

const country: Country = {
  name: ISO_3166_ALPHA_2_MAPPINGS.FR,
  isoCode: 'FR',
  callingCode: 33,
  format: '+.. ... .. .. ..',
  regions: ['europe', 'european-union']
}

describe('helpers/phone-number', () => {
  describe('getCallingCode', () => {
    it('should return a number for a valid phone number', () => {
      expect(getCallingCode(3367877767)).toBe(33)
    })

    it('should return null for an invalid phone number', () => {
      expect(getCallingCode(3)).toBe(null)
    })

    it('should return the calling code with a + character', () => {
      expect(getCallingCode('+33')).toBe(33)
    })

    it('should return null for +00', () => {
      expect(getCallingCode('+00')).toBe(null)
    })
  })

  describe('matchIsValidCallingCode', () => {
    it('should return a boolean', () => {
      expect(matchIsValidCallingCode(0)).toBeTypeOf('boolean')
    })

    it('should return false for an invalid calling code', () => {
      expect(matchIsValidCallingCode(0)).toBe(false)
    })

    it('should return false for a long phone number', () => {
      expect(matchIsValidCallingCode(33626787689)).toBe(false)
    })

    it('should return true for a valid calling code', () => {
      expect(matchIsValidCallingCode(33)).toBe(true)
    })
  })

  describe('matchStartsWithCallingCode', () => {
    it('should return a boolean', () => {
      expect(matchStartsWithCallingCode(0, 0)).toBeTypeOf('boolean')
    })

    it('should return true for number with the correct calling code', () => {
      expect(matchStartsWithCallingCode(336269222635, 33)).toBe(true)
    })

    it('should return false for number without the correct calling code', () => {
      expect(matchStartsWithCallingCode(326269222635, 33)).toBe(false)
    })
  })

  describe('applyMaskToInputValue', () => {
    it('should return a string', () => {
      expect(applyMaskToInputValue('', '')).toBeTypeOf('string')
    })

    it('should return the correct style phone number completed', () => {
      expect(applyMaskToInputValue('33269227363', '+.. ... .. .. ..')).toBe(
        '+33 269 22 73 63'
      )
    })

    it('should return portion of the correct style for a non completed value', () => {
      expect(applyMaskToInputValue('33', '+.. ... .. .. ..')).toBe('+33')
    })
  })

  describe('buildValue', () => {
    it('should return a string', () => {
      expect(buildValue('+33', country)).toBeTypeOf('string')
    })

    it('should return the exact same value for a country without format', () => {
      expect(
        buildValue('32626922631', {
          ...country,
          format: undefined
        })
      ).toBe('32626922631')
    })

    it('should return the value with style of the country FR', () => {
      expect(buildValue('33626922631', country)).toBe('+33 626 92 26 31')
    })

    it('should return the value with style of the country BE', () => {
      expect(buildValue('32626922631', country)).toBe('+32 626 92 26 31')
    })
  })
})