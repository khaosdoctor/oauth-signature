# OAuth signature

> OAuth 1.0a signature generator for Deno

Generates both the base string and the signature for OAuth 1.0a requests. Explained in [this article](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature).

## Usage

The package has 2 functions and 1 type:

- `generateBaseString` - generates the base string for the request given an input object
- `sign` - generates the signature for the request given the base string, a consumer signing key and an algorithm to digest the signature
- `BaseStringSegments` - type of the input object for `generateBaseString` or `sign`

```ts
import { sign, generateBaseString, type BaseStringSegments } from "https://deno.land/x/oauth_signature/mod.ts";
```

You can also import the functions separately:

```ts
import { sign } from "https://deno.land/x/oauth_signature/src/signature.ts";
import { generateBaseString, type BaseStringSegments } from "https://deno.land/x/oauth_signature/src/baseString.ts";
```

## API

### `generateBaseString(input: BaseStringSegments): Promise<string>`

Given the input:

```ts
const baseString = await generateBaseString({
  method: "POST",
  url: "https://api.twitter.com/oauth/request_token",
  parameters: {
    oauth_callback: "http://localhost:3000/callback",
    oauth_consumer_key: "xvz1evFS4wEEPTGEFPHBog",
    oauth_nonce: "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: "1318622958",
    oauth_version: "1.0",
  },
});
```

Outputs:

```ts
POST&https%3A%2F%2Fapi.twitter.com%2Foauth%2Frequest_token&oauth_callback%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fcallback%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_version%3D1.0
```

### `sign(baseString: string | BaseStringSegments, signingKey: string, algorithm: string = 'SHA-1'): Promise<OutputFormats>`

The base string can either be a string, or an object of type `BaseStringSegments` (see above). If it's a string, it will be used as is, otherwise it will be generated using the `generateBaseString` function.

> Generating the signature with a plain string is the same as signing any data with a key, so you can use this function to sign any data with any key.

By default, the algorithm used to digest the signature is SHA-1, but you can use any algorithm supported by the `webcrypto` standard:

```ts
// https://deno.land/std/crypto/crypto.ts
const webCryptoDigestAlgorithms = [
  "SHA-384",
  "SHA-256",
  "SHA-512",
  // insecure (length-extendable and collidable):
  "SHA-1",
] as const;
```

The function returns an object with output formats as functions:

```ts
{
  asBase64: () => base64Encode(signed), // base64 encoded
  asHex: () => new TextDecoder().decode(hexEncode(new Uint8Array(signed))), // hex string
  asPercentEncodedBase64: () => percentEncode(base64Encode(signed)), // percent encoded base64 (encoded URI component)
  asArrayBuffer: () => signed, // raw output
  asUint8Array: () => new Uint8Array(signed), // Uint8Array version
  asString: () => new TextDecoder().decode(signed), // string version
}
```

## Example

```ts
const key = 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
const baseString =
  'POST&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521'
const signature = await getSignature(baseString, key)
console.log(signature.asBase64()) // hCtSmYh+iHYCEqBWrE7C7hYmtUk=
```
