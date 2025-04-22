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

## Encryption

**Cryptography** is the science of hiding data and making it available again. In cryptography, hiding data is called **encryption** and unhiding it is called **decryption**. When data is securely exchanged, it is first encrypted by the sender, and then decrypted by the receiver using a special key.

### Symmetric encryption

- uses the same key to both encrypt and decrypt data.

Symmetric encryption is the fastest way to encrypt data, and the most common for sending large chunks of data, however, it has one major vulnerability: if you send someone your key, then it’s in a form that any other person can read. That means your data is vulnerable to being stolen.

### Asymmetric encryption

- uses two different keys to encrypt and decrypt data.

Asymmetric encryption differs from symmetric encryption in one way: Instead of one key, you have a key pair. A key pair is made up of a public key and a private key.

- The **public** key can be given to anyone and is only used to encrypt data.
- The **private** key is kept secret and is only used to decrypt data.

What’s the use of having two keys? Having two keys mean you are the only person who ever has access to the private key used to decrypt data, so it is impossible for someone to intercept and read your messages.

For example, if you want to receive an encrypted message from someone, you would first generate a key pair and give them the public key. Then, they would write a message and encrypt it using the public key you gave them. Finally, they would send you the message and you would decrypt it with your private key.

An image showing the sender using one key to encrypt the data and the recipient using a different key to decrypt the data.

Asymmetric encryption is the most secure way to transmit data; however, it is slower and more complex than symmetric encryption. Therefore, it is primarily used to exchange smaller pieces of data.

## Hashing

Hashing does not encrypt data. Instead, hashing is a one-way process that takes a piece of data of any size and uses a mathematical function to represent that data with a unique hash value of a fixed size. You cannot compute the original data from its hash.

![Cryptography vs Hashing](./hashingVSencryption.png)

Because each hash should be unique, hashing allows us to see if changes have been made to documents.

Ideally, hash functions always generate unique values for different inputs. When they don’t it’s called a hash collision. While it’s hypothetically possible to encounter a hash collision with nearly any hashing algorithm, with modern algorithms like SHA-256, it would take so long to result in a collision that it’s functionally impossible. Earlier hashing algorithms, like MD5 and SHA-1, are more likely to result in hash collisions.

### Using Hashing to protect data

Hashes are widely used in order to store passwords in online databases. If passwords are stored in plaintext and a database is breached, so are all of the passwords! However, if they are stored as hash values, even if someone hacks into a website’s database, only the password hashes are exposed.

For example, let’s suppose a user’s password is:

```
CodecademyIsGr8t
```

Now, if the website storing the password is using a SHA-256 hash, even if someone hacked into that website, all the hacker would see is the hash value:

```
d04f855e71ad9d495d91e666175d593b669f45970f885a258f6dbbaab262ac8b
```

Remember, an attacker has no way of decrypting a hash value to get the original value. Hashing is a one-way process.

In the login process, hashing is used to securely verify passwords without storing them in plaintext. Here’s how it works:

1. User Registration: When a user creates an account, their password is hashed using a secure hash function, and the hash is stored in the database.

2. User Login: When the user logs in, they enter their password.

3. Hashing: The entered password is hashed using the same hash function.

4. Comparison: The newly generated hash is compared to the stored hash in the database.

5. Authentication: If the hashes match, the user is authenticated; otherwise, access is denied.

This process ensures that even if the database is compromised, the original passwords remain secure.

## Encoding

**Encoding**, while it may sound similar to encryption, is not actually used to hide data. Encoding transforms data into a form that can be used by a different type of system. Some different types of encoding are:

- ASCII (American Standard Code for Information Interchange)
- Unicode
- Base64

Let’s look at ASCII as an example. **ASCII** is a character encoding standard that is used to translate human text into something a computer can understand and vice versa. It’s a shared language all computers use to translate human text.

Let’s look at the encoding process with the capital letter "`A`".

| Letter | Decimal Encoding | Binary Encoding |
| ------ | ---------------- | --------------- |
| A      | 65               | 100 0001        |
| B      | 66               | 100 0010        |
| C      | 67               | 100 0011        |

Looking at an ASCII table, we can encode the capital letter “`A`” as the number `65`. Then, we have to translate `65` into binary which gives us the value `100 0001`. Using ASCII encoding, we are able to change “`A`” into something another system, our computer, can understand.

Encoded information is easily reversed and only requires knowledge of the algorithm used to decode information.

## Obfuscation

**Obfuscation** is less about data security and more about securing code. Developers might obfuscate their code in order to hide what their code is actually doing. Obfuscate means to hide the meaning of something by making it difficult to understand.

Developers might want to hide trade secrets or intellectual property from others who can access their code. Obfuscating their code makes it difficult for others to steal code and use it for their own purposes. Obfuscation can also make it harder for users to hack software or get around licensing requirements needed to use programs.

Malicious actors might also use obfuscation to make it hard for users or antivirus software to detect a virus they are planting on a system.
