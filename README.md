# otp
Simple library for generating one-time-passwords which are compatible with authenticator apps such as Google Authenticator.

## Installtion
```
npm install npm i @pounce-app/otc
```

## Usage
```typescript
import OtcGenerator from '@pounce-app/otc';

const otc = new OtcGenerator({ issuer: 'MyOrganization' });

// Generate a pairing code for pairing with an authenticator app.
otc.getPairingCode('user@myorganization.com', 'super_secret_key');

// Validate user supplied code.
const users_code = ...;
if (otc.getCurrentCode('super_secret_key') === users_code) { ... }
```

## Generating QR Codes
This library does not generate QR codes for pairing with mobile authenticator apps, however a QR code can be trivially generated using the Google Charts API, as follows.
```typescript
const code = otc.getPairingCode(user, secret);
const qr_url = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(code.url)}`;
```

## Additional Concerns
This library simply provides mechanisms to generate TOTP codes. It is up the user to ensure that these codes are kept secure. Mainly, ensure the following:

 - Each user is assigned a random secret string, generated at the time of provisioning their pairing code. Keep this secret absolutely secure, for all intents and purposes this is a second password for the users account, and should be treated as such.
 - This library makes no attempt to ensure the same code is not used more than once in the same time period. In the future I will add a mechanism to obtain the current time value used for a call to `getCurrentCode`, which will be able to be used to ensure that codes are not used more than once.
 - For more information, see [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238).
