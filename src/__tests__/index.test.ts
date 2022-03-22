import OtcGenerator from "../index";
import base32 from "../base32";
import hotp from "../hotp";

test("base32", () => {
  expect(base32("")).toBe("");
  expect(base32("f")).toBe("MY");
  expect(base32("fo")).toBe("MZXQ");
  expect(base32("foo")).toBe("MZXW6");
  expect(base32("foob")).toBe("MZXW6YQ");
  expect(base32("fooba")).toBe("MZXW6YTB");
  expect(base32("foobar")).toBe("MZXW6YTBOI");
  expect(base32("sure.")).toBe("ON2XEZJO");
  expect(base32("sure")).toBe("ON2XEZI");
  expect(base32("sur")).toBe("ON2XE");
  expect(base32("su")).toBe("ON2Q");
  expect(base32("leasure.")).toBe("NRSWC43VOJSS4");
  expect(base32("easure.")).toBe("MVQXG5LSMUXA");
  expect(base32("asure.")).toBe("MFZXK4TFFY");
  expect(base32("sure.")).toBe("ON2XEZJO");
});

test("hotp", () => {
  const secret = "12345678901234567890";
  expect(hotp(secret, 0x0000000000000001, 8)).toBe("94287082");
  expect(hotp(secret, 0x00000000023523ec, 8)).toBe("07081804");
  expect(hotp(secret, 0x00000000023523ed, 8)).toBe("14050471");
  expect(hotp(secret, 0x000000000273ef07, 8)).toBe("89005924");
  expect(hotp(secret, 0x0000000003f940aa, 8)).toBe("69279037");
  expect(hotp(secret, 0x0000000027bc86aa, 8)).toBe("65353130");

  expect(hotp(secret, 0, 6)).toBe("755224");
  expect(hotp(secret, 1, 6)).toBe("287082");
  expect(hotp(secret, 2, 6)).toBe("359152");
  expect(hotp(secret, 3, 6)).toBe("969429");
  expect(hotp(secret, 4, 6)).toBe("338314");
  expect(hotp(secret, 5, 6)).toBe("254676");
  expect(hotp(secret, 6, 6)).toBe("287922");
  expect(hotp(secret, 7, 6)).toBe("162583");
  expect(hotp(secret, 8, 6)).toBe("399871");
  expect(hotp(secret, 9, 6)).toBe("520489");
});

test("getPairingCode", () => {
  const otc = new OtcGenerator();
  const secret = "foobar";
  const code = otc.getPairingCode("admin", secret);

  expect(code).toBeDefined();
  expect(code.code).toBe("MZXW6YTBOI");
  expect(code.url).toBe(
    `otpauth://totp/admin?secret=MZXW6YTBOI&algorithm=SHA1&digits=6&period=30`
  );
});

test("getPairingCode with issuer", () => {
  const otc = new OtcGenerator({ issuer: "org" });
  const secret = "foobar";
  const code = otc.getPairingCode("admin", secret);

  expect(code).toBeDefined();
  expect(code.code).toBe("MZXW6YTBOI");
  expect(code.url).toBe(
    `otpauth://totp/org:admin?secret=MZXW6YTBOI&issuer=org&algorithm=SHA1&digits=6&period=30`
  );
});
