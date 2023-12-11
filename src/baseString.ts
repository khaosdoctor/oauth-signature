import { percentEncode } from './deps.ts'

export interface BaseStringSegments {
	method: string
	url: string
	parameters: Record<string, string>
}

async function generateParameterString(parameters: BaseStringSegments['parameters']) {
	const keys = Object.keys(parameters).sort()
	const pairs = await Promise.all(keys.map(async (key) => {
		const encoded = `${await percentEncode(key)}=${await percentEncode(parameters[key])}`
		return encoded
	}))
	return pairs.join('&')
}

function assertValidUrl(url: string) {
	try {
		new URL(url)
	} catch (error) {
		throw error
	}
}

export async function generateBaseString(segments: BaseStringSegments) {
	assertValidUrl(segments.url)
	const parameterString = await generateParameterString(segments.parameters)
	return `${segments.method.toUpperCase()}&${await percentEncode(segments.url)}&${await percentEncode(parameterString)}`
}
