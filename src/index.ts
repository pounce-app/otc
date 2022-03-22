import base32 from "./base32";
import hotp from "./hotp";

/**
 * Options for the generator.
 */
export interface OtcGeneratorOptions {
  /**
   * The name of the entity issuing pairing codes.
   */
  issuer?: string;

  /**
   * The length of TOTP code to generate.
   *
   * NOTE: Google Authenticator and Microsoft Authenticator only support 6 digit codes.
   */
  digits?: 6 | 7 | 8;
}

/**
 * A combination of a manually enterable code and a TOTP URI which can be encoded as a QR code.
 */
export interface PairingCode {
  /**
   * The manual pairing code, if the user cannot scan a QR code.
   */
  code: string;

  /**
   * The TOTP URI string. This can be encoded as a QR code which the user can scan with their authenticator app.
   */
  url: string;
}

/**
 * Class which can be used to generate both pairing codes and one time passwords
 */
export default class OtcGenerator {
  constructor(private readonly options: OtcGeneratorOptions = {}) {}

  /**
   * Generates a pairing code which can be used to provision a users authentication app.
   * @param {string} user Some public data which can be used to identify the account, could be the users name, email, etc.
   * @param {string} user_secret The users secret key, should be unique for each user.
   * @returns {PairingCode} The generated pairing code.
   */
  getPairingCode(user: string, user_secret: string): PairingCode {
    const secret = base32(user_secret);
    const url = `otpauth://totp/${
      this.options.issuer ? `${this.options.issuer}:` : ""
    }${user}?secret=${secret}${
      this.options.issuer ? `&issuer=${this.options.issuer}` : ""
    }&algorithm=SHA1&digits=${this.options.digits || 6}&period=30`;

    return {
      code: secret,
      url: url,
    };
  }

  /**
   * Gets the one time code which corresponds to the current time period.
   * @param {string} user_secret The users secret key, should be the same that was used to generate the pairing code with `getPairingCode`.
   * @returns {string} The generated code.
   */
  getCurrentCode(user_secret: string): string {
    const time = Math.floor(Math.floor(Date.now() / 1000) / 30);
    return this.getCode(user_secret, time);
  }

  /**
   * Generates a one time code for the specified time period.
   * @param {string} user_secret The users secret key, should be the same that was used to generate the pairing code with `getPairingCode`.
   * @param {number} time The time counter value to generate the code for.
   * @returns {string} The generated code.
   */
  getCode(user_secret: string, time: number): string {
    return hotp(user_secret, time, this.options.digits || 6);
  }
}
