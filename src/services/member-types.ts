import { ChangeMemberTypeDTO } from './../utils/DB/entities/DBMemberTypes';
import { FastifyInstance } from 'fastify';

export default class MemberTypesService {
  static getAllMemberTypes(fastify: FastifyInstance) {
    return fastify.db.memberTypes.findMany();
  }
  static async getMemberTypeById(fastify: FastifyInstance, id: string) {
    const memberType = await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: id,
    });
    if (!memberType) {
      throw fastify.httpErrors.notFound();
    }
    return memberType;
  }

  static async updateMemberType(
    fastify: FastifyInstance,
    memberTypeId: string,
    changeMemberTypeDto: ChangeMemberTypeDTO
  ) {
    const memberType = await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: memberTypeId,
    });
    if (!memberType) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.memberTypes.change(memberTypeId, changeMemberTypeDto);
  }
}
