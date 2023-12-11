import { BaseStringSegments } from './baseString.ts'
import { assertEquals } from './deps.ts'
import { getSignature } from './signature.ts'

// All this data is from https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature
Deno.test('signature', async (t) => {
	const algorithms = [
		['SHA-384', 'F1cQ4uwAYyk6GpK/zRHIZqd1KbhfUT0NkHPP7MFm41dN3czseX+hMYLbIfHsmD/y'],
		['SHA-256', 'Tp6gtfOx2bNZeJ2UUOeg9hvSzdsLa5QJoUwc/LeRFRA='],
		['SHA-512', 'gBdvcZjHZxl/xaFdwZaSyT2ztWBWOw7UveNETUrbC/mVxnp10kRrz+W5hT48mZHysCuBx8/Gp8P2Y8OlCvmEfg=='],
		['SHA-1', 'hCtSmYh+iHYCEqBWrE7C7hYmtUk='],
	] as const
	const key = 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
	const baseString =
		'POST&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521'
	const baseSegment: BaseStringSegments = {
		url: 'https://api.twitter.com/1.1/statuses/update.json',
		method: 'POST',
		parameters: {
			status: 'Hello Ladies + Gentlemen, a signed OAuth request!',
			include_entities: 'true',
			oauth_consumer_key: 'xvz1evFS4wEEPTGEFPHBog',
			oauth_nonce: 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
			oauth_signature_method: 'HMAC-SHA1',
			oauth_timestamp: '1318622958',
			oauth_token: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
			oauth_version: '1.0',
		},
	}

	for (const [algorithm, expected] of algorithms) {
		await t.step(`should generate a ${algorithm} signature with a string input`, async () => {
			const signature = await getSignature(baseString, key, algorithm)
			assertEquals(signature.asBase64(), expected)
		})

		await t.step(`should generate a ${algorithm} signature with an object input`, async () => {
			const signature = await getSignature(baseSegment, key, algorithm)
			assertEquals(signature.asBase64(), expected)
		})
	}
})
