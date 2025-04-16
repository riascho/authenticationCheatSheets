# Authentication and Authorization

## Overview

This repository is a collection of demos on how to implement session management and cookies using Express.js.

## Notes

|                           | **Cookies**   | **localStorage**                       | **sessionStorage**      |
| ------------------------- | ------------- | -------------------------------------- | ----------------------- |
| **Read by Server**        | Yes           | No                                     | No                      |
| **Capacity**              | 4 KB / Domain | 10 MB / Domain                         | 5 MB / Domain           |
| **Expiry**                | Custom        | Never or On Manual Deletion in Browser | When Session Tab Closes |
| **Browser Compatibility** | HTML4, HTML5  | HTML5                                  | HTML5                   |
| **Access From**           | Any Window    | Any Window                             | Same Tab                |

## [Session Authentication & Cookies](./session_cookies.ts)

- Express session middleware configuration
- Custom session interface implementation
- In-memory session store (MemoryStore) (not suitable for production)
- Cookie configuration with security settings
- Session management demonstration
- Full Demo App from [Codecademy](./codecademy/)

## [JSON Web Tokens(JWTs)](./jwt.ts) _© from Codecademy_

JSON Web Tokens are self-contained JSON objects that compactly and securely transmit information between two parties. They are secure because they are digitally signed using a secret or a public/private key pair.

As a reminder, JSON, or JavaScript Object Notation, is essentially a slightly stricter version of a Javascript object. A JSON object should be enclosed in curly braces and may contain one or more key-value pairs.

```json
{
  "name": "Harine",
  "age": 20,
  "country": "Canada"
}
```

### Components of a JWT

A JWT is made up of three components:

- Header
- Payload
- Signature

#### JWT Header

A JWT header contains the type of the token we’re creating and the signing algorithm that will be used.

**Type**: The type of this token will always be “JWT”. The Internet Assigned Numbers Authority, or [IANA](https://www.iana.org/), coordinates internet protocol resources across the globe. The “JWT” type aligns with the media type “application/jwt“.

**Algorithm**: The signing, or hashing, algorithm used might vary. Some commonly used algorithms are HMAC-SHA256, represented by "HS256", RSA with SHA-256, represented by "RW256", and ECDSA with SHA-256, represented by "ES256".

Here’s an example of a header specifying the HMAC-SHA256 algorithm:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### JWT Payload

A JWT payload contains claims about an entity. A claim is a statement or piece of information and the entity is often a user.

There are three types of claims a JWT payload can contain:

**Registered Claims:** These are predefined claim types that anyone can use in a JWT.

**Public Claims:** These are custom claim types that are created by a developer and can be used publicly. They should be registered to avoid collisions, also known as repeated claims.

**Private Claims:** These are custom claim types that are not registered or public. They are only used between parties that have agreed to use them.

Here’s an example payload using some common registered claims:

```json
{
  "sub": "1234567890",
  "name": "Harine Cooper",
  "admin": false,
  "iat": 1620924478,
  "exp": 1620939187
}
```

You can find a list of registered claims and public claims which have been registered in the [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml#claims).

#### JWT Signature

A [JWT signature](https://datatracker.ietf.org/doc/html/rfc7515) is used to verify that the JWT wasn’t tampered with or changed. It can be created taking the encoded header, the encoded payload, a secret, and using the hashing algorithm to create a hash from those elements.

The secret is a symmetric key known by the sender and receiver of this token.

In this example, we will use jwt.io’s JWT debugger to create our final JWT.

- The Base64Url encoding of our header is: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

- The Base64Url encoding of our payload is: `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhhcmluZSBDb29wZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYyMDkyNDQ3OCwiZXhwIjoxNjIwOTM5MTg3fQ`

- Finally, we use the HMAC-SHA256 algorithm we defined in our header to create our signature:

```
HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload),
secret)
```

- which gives us: `3B-FLgPETrExxlDKW30AoU7KGE6xuZodw79TQR8_mwM`

- Concatenating our encoded header, our encoded payload, and our signature, and separating each with a “.”, gives us our final token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhhcmluZSBDb29wZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYyMDkyNDQ3OCwiZXhwIjoxNjIwOTM5MTg3fQ.3B-FLgPETrExxlDKW30AoU7KGE6xuZodw79TQR8_mwM`

### How Do We Use a JWT?

#### Properly Storing A JWT

Now that we’ve stored our user’s information in our JWT, what do we do with it? How do we use the information in our JWT when communicating with our server?

The user logs into a website and their information is sent to the server.
The server creates a JWT with a secret
The JWT is returned to the browser
The user makes another request, and the browser sends the JWT back to the server in the Authorization header using the Bearer schema.
With our newly created JWT, this would look like:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhhcmluZSBDb29wZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYyMDkyNDQ3OCwiZXhwIjoxNjIwOTM5MTg3fQ.3B-FLgPETrExxlDKW30AoU7KGE6xuZodw79TQR8_mwM
```

The server verifies the JWT signature and gets user information from the JWT.
The server will send a response back to the browser. If the JWT is valid, the browser will receive what it requested, if the JWT was not valid, the browser will likely receive an error message.

An image showing that first, the user logs in, then the server creates a JWT with a secret. Next, the server returns the JWT to the browser. The Browser sends the JWT on the Authorization header. The server verifies the JWT and sends a response to the client.

#### Improperly Storing a JWT

Do not store your JWT in localStorage as an attacker could use Cross-Site Scripting attacks to steal local data.

Storing your JWT in a cookie may seem like a solution to this, but could expose your data to a Cross-Site Resource Forgery attack. Additionally, if a user has disabled cookies in their browser, the application is now unable to store the JWT.

### Why Use JWTs?

#### JWTs are used for:

- **Authorization**: They’re often used for SSO.
- **Information Exchange:** If a server received a valid JWT, it knows the sender is who they say they are and the information hasn’t been tampered with.

Parsing JSON is easier than some alternatives like XML or SAML.
JWTs are small, scale well, and are easier for mobile devices to process.
Why are some reasons we might not want to a JWT?

A mix of a public and private key-pair adds security, but can also add complexity.
Sensitive information, like passwords or Social Security Numbers, should not be stored client-side, even if it is encoded.

### Conclusion

JWTs are another tool that we can use to exchange information or help authorize requests for a user. Whether you use JWTs or not might depend on if you’re working with existing code, your security or technology requirements, or other developers’ comfort with the technology. It’s up to you to decide if they work for your specific use case.
