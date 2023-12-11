import { base64Encode, crypto, hexEncode, percentEncode } from './deps.ts'
type WebCryptoDigestAlgorithms = 'SHA-384' | 'SHA-256' | 'SHA-512' | 'SHA-1'

export async function getSignature(
	baseString: string,
	signingKey: string,
	algorithm: WebCryptoDigestAlgorithms = 'SHA-1',
) {
	const { encode } = new TextEncoder()
	const key = await crypto.subtle.importKey(
		'raw',
		encode(signingKey),
		{ name: 'HMAC', hash: { name: algorithm } },
		false,
		['sign'],
	)

	const signed = await crypto.subtle.sign(algorithm, key, encode(baseString))

	return {
		asBase64: () => base64Encode(signed),
		asHex: () => hexEncode(new Uint8Array(signed)),
		asPercentEncodedBase64: () => percentEncode(base64Encode(signed)),
		asArrayBuffer: () => signed,
		asUint8Array: () => new Uint8Array(signed),
		asString: () => new TextDecoder().decode(signed),
	}
}
