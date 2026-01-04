import { inject, injectable } from "inversify";
import type { SessionContext, SessionService } from "../session-service.interface";
import { TYPES } from "@/di/types";
import type { SessionRepository } from "@/repository/session-repository";
import type { GeoInfoRepository } from "@/repository/geo-info-repository";
import type { UserAgentRepository } from "@/repository/user-agent-repository";
import type { IpService } from "../ip-service.interface";
import { createHash } from "crypto";
import type { AgentDetails } from "express-useragent";
import type { DbOrTransaction } from "@/db";
import type { GetSessionResponse } from "@/dto/session-response";

@injectable()
export class SessionServiceImpl implements SessionService {
  constructor(
    @inject(TYPES.SessionRepository) private sessionRepository: SessionRepository,
    @inject(TYPES.GeoInfoRepository) private geoInfoRepository: GeoInfoRepository,
    @inject(TYPES.UserAgentRepository) private userAgentRepository: UserAgentRepository,

    @inject(TYPES.IpService) private ipService: IpService,
  ) {}

  async saveSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    expiresAt: Date,
    context: SessionContext,
    tx?: DbOrTransaction
  ): Promise<void> {

    const geoInfoId = await this.getOrCreateGeoInfo(context.ip, tx);

    const userAgentId = await this.getOrCreateUserAgent(context.userAgent, tx);

    await this.sessionRepository.create({
      id: sessionId,
      token: refreshToken,
      expiresAt,
      userId,
      geoInfoId,
      userAgentId
    }, tx);

  }

  // async getSessions(userId: string, tx?: DbOrTransaction): Promise<Session[] | undefined> {
  //   return await this.sessionRepository.findByUserId(userId);
  // }

  async getSessions(userId: string, tx?: DbOrTransaction): Promise<GetSessionResponse[]> {
    return await this.sessionRepository.findByUserId(userId);
  }

  async updateSession(sessionId: string, tx?: DbOrTransaction): Promise<void> {
    // Update the session's updatedAt timestamp to track activity
    await this.sessionRepository.update(sessionId, {}, tx);
  }

  async deleteSession(
    userId: string,
    sessionId: string,
    tx?: DbOrTransaction
  ): Promise<boolean> {
    return await this.sessionRepository.deleteByIdAndUserId(sessionId, userId, tx);
  }

  async deleteAllSessionsExcept(
    userId: string,
    currentSessionId: string,
    tx?: DbOrTransaction
  ): Promise<number> {
    return await this.sessionRepository.deleteAllExcept(userId, currentSessionId, tx);
  }

  // Helper functions

  private async getOrCreateGeoInfo(ip: string, tx?: DbOrTransaction): Promise<string> {
    // Check whether ip is already present, if so return it
    const existing = await this.geoInfoRepository.findByIp(ip, tx);
    if (existing) {
      return existing.id;
    }

    // Fetch the ip details from external API
    const geoData = await this.ipService.getDetails(ip);

    // Generate deterministic ID from IP
    const id = createHash("sha256").update(ip).digest("hex").slice(0, 32);

    // Save and return
    if (geoData?.status === "success") {
      const created = await this.geoInfoRepository.create({
        id,
        ip,
        countryCode: geoData.countryCode,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.lat,
        longitude: geoData.lon,
        timezone: geoData.timezone,
        offset: geoData.offset,
      }, tx);
      return created!.id;
    }

    // If IP lookup failed, still create record with just the IP
    const created = await this.geoInfoRepository.create({ id, ip }, tx);
    return created!.id;
  }

  private async getOrCreateUserAgent(userAgent: AgentDetails, tx?: DbOrTransaction): Promise<string> {
    // Create deterministic ID from UA properties
    const uaKey = `${userAgent.browser}|${userAgent.os}|${userAgent.platform}|${userAgent.isMobile}`;
    const id = createHash("sha256").update(uaKey).digest("hex").slice(0, 32);

    // Check if present, return it
    const existing = await this.userAgentRepository.findById(id, tx);
    if (existing) {
      return existing.id;
    }

    // If not present, create and return
    const created = await this.userAgentRepository.create({
      id,
      browser: userAgent.browser,
      operatingSystem: userAgent.os,
      isMobile: userAgent.isMobile,
      platform: userAgent.platform,
    }, tx);

    return created!.id;
  }

}
