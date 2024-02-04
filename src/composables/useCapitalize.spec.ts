import { it, describe, expect } from 'vitest'
import { useCapitalize } from './useCapitalize'

describe('useCapitalize', () => {
    it('should capitalize the first letters of a string', () => {
        const { capitalizeFirstLetters } = useCapitalize()
        expect(capitalizeFirstLetters('hello world')).toBe('Hello World')
        expect(capitalizeFirstLetters('test string')).toBe('Test String')
        expect(capitalizeFirstLetters('another test string')).toBe('Another Test String')
    })
})