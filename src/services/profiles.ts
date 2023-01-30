import {
  CreateProfileDTO,
  ChangeProfileDTO,
} from './../utils/DB/entities/DBProfiles';
import { FastifyInstance } from 'fastify';

export default class ProfilesService {
  static getAllProfiles(fastify: FastifyInstance) {
    return fastify.db.profiles.findMany();
  }
  static async getProfileById(fastify: FastifyInstance, id: string) {
    const profile = await fastify.db.profiles.findOne({
      key: 'id',
      equals: id,
    });
    if (!profile) {
      throw fastify.httpErrors.notFound();
    }
    return profile;
  }
  static async createProfile(
    fastify: FastifyInstance,
    createProfileDto: CreateProfileDTO
  ) {
    const profile = await fastify.db.profiles.findOne({
      key: 'userId',
      equals: createProfileDto.userId,
    });
    const memberType = await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: createProfileDto.memberTypeId,
    });
    if (profile || !memberType) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.profiles.create(createProfileDto);
  }

  static async deleteProfile(fastify: FastifyInstance, id: string) {
    const profile = await fastify.db.profiles.findOne({
      key: 'id',
      equals: id,
    });
    if (!profile) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.profiles.delete(id);
  }

  static async updateProfile(
    fastify: FastifyInstance,
    profileId: string,
    changeProfileDto: ChangeProfileDTO
  ) {
    const profile = await fastify.db.profiles.findOne({
      key: 'id',
      equals: profileId,
    });
    if (!profile) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.profiles.change(profileId, changeProfileDto);
  }
}
