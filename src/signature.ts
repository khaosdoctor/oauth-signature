import { BaseStringSegments, generateBaseString } from './baseString.ts'
import { base64Encode, crypto, hexEncode, percentEncode } from './deps.ts'
type WebCryptoDigestAlgorithms = 'SHA-384' | 'SHA-256' | 'SHA-512' | 'SHA-1'

export async function getSignature(
	baseString: string | BaseStringSegments,
	signingKey: string,
	algorithm: WebCryptoDigestAlgorithms = 'SHA-1',
) {
	const maybeBaseString = typeof baseString === 'string' ? baseString : await generateBaseString(baseString)

	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(signingKey),
		{ name: 'HMAC', hash: { name: algorithm } },
		false,
		['sign'],
	)

	const signed = await crypto.subtle.sign('HMAC', key, enc.encode(maybeBaseString))

	return {
		asBase64: () => base64Encode(signed),
		asHex: () => new TextDecoder().decode(hexEncode(new Uint8Array(signed))),
		asPercentEncodedBase64: () => percentEncode(base64Encode(signed)),
		asArrayBuffer: () => signed,
		asUint8Array: () => new Uint8Array(signed),
		asString: () => new TextDecoder().decode(signed),
	}
}
