import { percentEncode } from './deps.ts'

export interface BaseStringSegments {
	method: string
	url: string
	parameters: Record<string, string>
}

function generateParameterString(parameters: BaseStringSegments['parameters']) {
	const keys = Object.keys(parameters).sort()
	const pairs = keys.map((key) => {
		return `${percentEncode(key)}=${percentEncode(parameters[key])}`
	})
	return pairs.join('&')
}

export function generateBaseString(segments: BaseStringSegments) {
	const parameterString = generateParameterString(segments.parameters)
	return `${segments.method.toUpperCase()}&${percentEncode(segments.url)}&${percentEncode(parameterString)}`
}
