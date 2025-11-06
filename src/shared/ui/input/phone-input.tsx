import { Group, Input, Select } from '@mantine/core'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import { useEffect, useState } from 'react'

const countryMasks = {
	ru: '+7 000 000 00 00',
	kz: '+7 000 000 00 00',
	by: '+375 00 000 00 00',
}

const countries = [
	{ value: 'ru', label: '🇷🇺 Россия', code: '+7' },
	{ value: 'kz', label: '🇰🇿 Казахстан', code: '+7' },
	{ value: 'by', label: '🇧🇾 Беларусь', code: '+375' },
]

export function PhoneInput({ variant, value, defaultValue, onChange, size, ...props }: Record<string, any>) {
	const detectCountryFromNumber = (phoneNumber: string, def: string | null = null) => {
		if (!phoneNumber) return def
		try {
			const phoneData = parsePhoneNumberFromString(phoneNumber)
			if (phoneData && phoneData.country) {
				return phoneData.country.toLowerCase()
			}
		} catch (error) {
			console.error('Не удалось определить страну:', error)
		}

		return def
	}

	const [phone, setPhone] = useState<string>(defaultValue || value || '')
	const [country, setCountry] = useState<string>(detectCountryFromNumber(phone, 'ru'))

	const handlePhoneChange = (value: string) => {
		setPhone(value)
		onChange?.(value)
		const newCountry = detectCountryFromNumber(value)
		if (newCountry && countries.find(c => c.value === newCountry)) {
			setCountry(newCountry)
		}
	}

	const formatPhoneNumber = (value: string, countryCode: string) => {
		if (!value) return ''
		const formatter = new AsYouType(countryCode.toUpperCase() as any)
		return formatter.input(value)
	}

	const formattedPhone = formatPhoneNumber(phone, country)

	useEffect(() => {
		handlePhoneChange(defaultValue)
	}, [defaultValue])

	return (
		<Input.Wrapper>
			<Group gap='0'>
				<Select
					value={country}
					onChange={setCountry}
					data={countries}
					style={{ width: size === 'md' ? 150 : 120 }}
					variant={variant}
					size={size}
					placeholder='Выберите страну'
				/>
				<Input
					{...props}
					value={formattedPhone}
					placeholder={countryMasks[country] || props.placeholder}
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
