import { Group, Input, Select } from '@mantine/core'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

const countryMasks = {
	ru: '+7 000 000 00 00',
	kz: '+7 000 000 00 00',
	by: '+375 00 000 00 00',
} as const

const countries = [
	{ value: 'ru', label: '🇷🇺 Россия', code: '+7' },
	{ value: 'kz', label: '🇰🇿 Казахстан', code: '+7' },
	{ value: 'by', label: '🇧🇾 Беларусь', code: '+375' },
] as const

const detectCountryFromNumber = (phoneNumber: string, def: string | null = null) => {
	if (!phoneNumber) return def
	try {
		const phoneData = parsePhoneNumberFromString(phoneNumber)
		if (phoneData?.country) {
			return phoneData.country.toLowerCase()
		}
	} catch (error) {
		console.error('Не удалось определить страну:', error)
	}

	return def
}

const formatPhoneNumber = (value: string, countryCode: string) => {
	if (!value) return ''
	const formatter = new AsYouType(countryCode.toUpperCase() as any)
	return formatter.input(value)
}

function PhoneInputRoot({ variant, value, defaultValue, onChange, size, ...props }: Record<string, any>) {
	const [phone, setPhone] = useState<string>(defaultValue || value || '')
	const [country, setCountry] = useState<string>(detectCountryFromNumber(phone, 'ru') ?? 'ru')

	const handlePhoneChange = useCallback((nextValue: string) => {
		setPhone(nextValue)
		onChange?.(nextValue)
		const newCountry = detectCountryFromNumber(nextValue)
		if (newCountry && countries.find((item) => item.value === newCountry)) {
			setCountry(newCountry)
		}
	}, [onChange])

	const formattedPhone = useMemo(
		() => formatPhoneNumber(phone, country),
		[phone, country],
	)

	const selectWidth = size === 'md' ? 150 : 120
	const placeholder = countryMasks[country as keyof typeof countryMasks] || props['placeholder']

	useEffect(() => {
		if (defaultValue !== undefined) {
			handlePhoneChange(defaultValue)
		}
	}, [defaultValue, handlePhoneChange])

	return (
		<Input.Wrapper>
			<Group gap='0'>
				<Select
					value={country}
					onChange={(nextCountry) => nextCountry && setCountry(nextCountry)}
					data={countries}
					style={{ width: selectWidth }}
					variant={variant}
					size={size}
					placeholder='Выберите страну'
				/>
				<Input
					{...props}
					value={formattedPhone}
					placeholder={placeholder}
					variant={variant}
					size={size}
					onChange={({ target }) => handlePhoneChange(target.value)}
					style={{ flex: 1 }}
					type='tel'
				/>
			</Group>
		</Input.Wrapper>
	)
}

export const PhoneInput = memo(PhoneInputRoot)
