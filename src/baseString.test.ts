import { BaseStringSegments, generateBaseString } from './baseString.ts'
import { assertEquals, assertRejects } from './deps.ts'

Deno.test('baseString', async ({ step }) => {
	await step('should be able to generate a base string', async () => {
		const segments: BaseStringSegments = {
			method: 'GET',
			url: 'https://example.com',
			parameters: {
				foo: 'bar',
				baz: '[][][]{}!%#@   ',
				abc: '123#$!@#(*(',
				snake_cased: 'true',
			},
		}
		const baseString = await generateBaseString(segments)
		assertEquals(
			baseString,
			'GET&https%3A%2F%2Fexample.com&abc%3D123%2523%2524%2521%2540%2523%2528%252A%2528%26baz%3D%255B%255D%255B%255D%255B%255D%257B%257D%2521%2525%2523%2540%2520%2520%2520%26foo%3Dbar%26snake_cased%3Dtrue',
		)
	})

	await step('should throw an error on invalid parameters', async () => {
		const segments: BaseStringSegments = {
			method: 'GET',
			url: 'example',
			parameters: {
				foo: 'bar',
			},
		}
		await assertRejects(() => generateBaseString(segments))
	})
})
