import { describe, expect, it } from 'vitest'

import { applyOtpInput, digitsOnly, formatDestination } from '../otp'

const empty = ['', '', '', '', '', '']

describe('digitsOnly', () => {
  it('keeps digits only', () => {
    expect(digitsOnly('12 3-a4')).toBe('1234')
  })
})

describe('applyOtpInput', () => {
  it('fills the box and moves on to the next', () => {
    expect(applyOtpInput(empty, 0, '5')).toEqual({
      digits: ['5', '', '', '', '', ''],
      focusIndex: 1,
    })
  })

  it('stays on the last box after the last digit', () => {
    expect(applyOtpInput(['1', '2', '3', '4', '5', ''], 5, '6')).toEqual({
      digits: ['1', '2', '3', '4', '5', '6'],
      focusIndex: 5,
    })
  })

  it('ignores letters', () => {
    expect(applyOtpInput(empty, 2, 'x').digits).toEqual(empty)
  })

  it('replaces a filled box when a new digit is typed over it', () => {
    const filled = ['5', '', '', '', '', '']
    expect(applyOtpInput(filled, 0, '52').digits[0]).toBe('2')
    expect(applyOtpInput(filled, 0, '25').digits[0]).toBe('2')
    expect(applyOtpInput(filled, 0, '55').digits[0]).toBe('5')
  })

  it('spreads a pasted or autofilled code from the box onwards', () => {
    expect(applyOtpInput(empty, 0, '123456')).toEqual({
      digits: ['1', '2', '3', '4', '5', '6'],
      focusIndex: 5,
    })
    expect(applyOtpInput(empty, 0, '12 34-56').digits.join('')).toBe('123456')
  })

  it('cuts a paste that is longer than the boxes left', () => {
    expect(applyOtpInput(['1', '2', '', '', '', ''], 2, '98765432').digits.join('')).toBe('129876')
  })

  it('leaves a hole when a box is emptied, without shifting the rest', () => {
    expect(applyOtpInput(['1', '2', '3', '', '', ''], 1, '')).toEqual({
      digits: ['1', '', '3', '', '', ''],
      focusIndex: 1,
    })
  })
})

describe('formatDestination', () => {
  it('shows a phone the way people write it, with the leading 0', () => {
    expect(formatDestination('phone', '+66812345678')).toBe('081-234-5678')
  })

  it('shows an email unchanged', () => {
    expect(formatDestination('email', 'name@example.com')).toBe('name@example.com')
  })
})
