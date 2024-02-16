import { Inject, Injectable, Logger } from "@nestjs/common";
import { FlattenedJWSInput, JWSHeaderParameters } from "jose";
import * as jose from "jose";
import { GetKeyFunction } from "jose/dist/types/types";
import { MODULE_OPTIONS_TOKEN } from "./token.module-definition";
import { TokenModuleOptions } from "./token.module-options.interface";
import { v4 } from "uuid";
import { exit } from "process";
import {
  KeyIdCannotBeFoundError,
  PrivateKeyNotPresentError,
  TokenSaveError
} from "./token.error";

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);
  private JWKS: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  private privateKey?: { key: jose.KeyLike; kid: string };
  private publicKey?: jose.KeyLike;
  private issuer: string;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: TokenModuleOptions
  ) {
    void this.initPublicKeys(options);
    void this.initPrivateKeys(options);
  }

  async initPublicKeys(options: TokenModuleOptions) {
    if (options.issuer === undefined) {
      if (options.localPublicKey === undefined) {
        await this.generateKeys();
        if (options.localPort === undefined) {
          this.logger.warn(
            "Assuming testing environment. Using generated public/private keys"
          );
          return;
        }
        await this.saveKeys();

        return;
      }

      const publicKeyDecoded = JSON.parse(
        Buffer.from(options.localPublicKey, "base64").toString("utf8")
      ) as jose.JWK;

      this.JWKS = jose.createLocalJWKSet({ keys: [publicKeyDecoded] });
      this.issuer = "http://localhost:" + options.localPort;
      this.logger.log(`Using local JWKS: ${this.issuer}`);
      return;
    }

    this.issuer = options.issuer;

    this.JWKS = jose.createRemoteJWKSet(
      new URL(`${options.issuer}/.well-known/jwks.json`)
    );
    this.logger.log(`Using remote JWKS: ${this.issuer}`);
  }

  async initPrivateKeys(options: TokenModuleOptions) {
    if (options.privateKey !== undefined) {
      const privateJWK = JSON.parse(
        Buffer.from(options.privateKey, "base64").toString("utf8")
      ) as unknown;

      const kid =
        privateJWK !== null &&
        typeof privateJWK === "object" &&
        "kid" in privateJWK &&
        typeof privateJWK.kid === "string"
          ? privateJWK.kid
          : undefined;

      if (kid === undefined) {
        throw new KeyIdCannotBeFoundError("kid is required");
      }

      const key = (await jose.importJWK(
        privateJWK as jose.JWK,
        "ES512"
      )) as jose.KeyLike;

      this.privateKey = {
        key,
        kid
      };

      this.logger.log(`Using private key with kid: ${kid}`);
      return;
    }

    this.logger.warn(
      "TokenService does not have a private key. And will not be able to sign tokens."
    );
  }

  async saveKeys() {
    if (this.privateKey === undefined) {
      throw new TokenSaveError("privateKey is required");
    }
    if (this.publicKey === undefined) {
      throw new TokenSaveError("publicKey is required");
    }

    const privateJWK = await jose.exportJWK(this.privateKey.key);

    const privKey = Buffer.from(
      JSON.stringify({
        ...privateJWK,
        kid: this.privateKey.kid,
        alg: "ES512",
        use: "sig"
      })
    ).toString("base64");

    const publicJwk = await jose.exportJWK(this.publicKey);

    const pubJwk = {
      ...publicJwk,
      kid: this.privateKey.kid,
      alg: "ES512",
      use: "sig"
    };

    const pubKey = Buffer.from(JSON.stringify(pubJwk)).toString("base64");

    this.logger.error(
      `Please save this values to your .env.local file and restart the server\nJWT_PRIVATE=${privKey}\nJWT_MOCK_PUBLIC=${pubKey}`
    );

    exit(-1);
  }
  async generateKeys() {
    const keys = await jose.generateKeyPair("ES512", { extractable: true });

    const publicJwk = await jose.exportJWK(keys.publicKey);

    const kid = v4();
    const pubJwk = { ...publicJwk, kid, alg: "ES512", use: "sig" };

    this.privateKey = {
      key: keys.privateKey,
      kid
    };
    this.publicKey = keys.publicKey;
    this.JWKS = jose.createLocalJWKSet({ keys: [pubJwk] });
    return;
  }

  async signToken(object: jose.JWTPayload, expiresOn: number) {
    if (this.privateKey === undefined) {
      this.logger.error("No private key provided");
      throw new PrivateKeyNotPresentError("No private key provided");
    }
    this.logger.debug(
      `Signing ${object.aud} token #[${object.jti}] for subject (${object.sub}) with private key: ${this.privateKey.kid}`
    );
    const rootJwt = await new jose.SignJWT(object)
      .setExpirationTime(expiresOn)
      .setIssuer(this.issuer)
      .setIssuedAt()
      .setNotBefore("0s")
      .setProtectedHeader({
        alg: "ES512",
        kid: this.privateKey.kid
      })
      .sign(this.privateKey.key);

    return rootJwt;
  }

  async verifyToken(token: string, audience: string) {
    const { payload } = await jose.jwtVerify(token, this.JWKS, {
      audience
    });

    return payload;
  }
}
