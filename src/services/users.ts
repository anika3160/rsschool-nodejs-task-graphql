import { FastifyInstance } from 'fastify';
import { ChangeUserDTO, CreateUserDTO } from '../utils/DB/entities/DBUsers';

export default class UsersService {
  static getAllUsers(fastify: FastifyInstance) {
    return fastify.db.users.findMany();
  }
  static async getUserById(fastify: FastifyInstance, id: string) {
    const user = await fastify.db.users.findOne({
      key: 'id',
      equals: id,
    });
    if (!user) {
      throw fastify.httpErrors.notFound();
    }
    return user;
  }
  static createUser(fastify: FastifyInstance, createUserDto: CreateUserDTO) {
    return fastify.db.users.create(createUserDto);
  }

  static async deleteUser(fastify: FastifyInstance, id: string) {
    const user = await fastify.db.users.findOne({
      key: 'id',
      equals: id,
    });
    if (!user) {
      throw fastify.httpErrors.badRequest();
    }
    const subscribers = await fastify.db.users.findMany({
      key: 'subscribedToUserIds',
      equals: [user.id],
    });
    await Promise.all(
      subscribers.map((subsriber) =>
        fastify.db.users.change(subsriber.id, {
          subscribedToUserIds: user!.subscribedToUserIds.filter(
            (id) => id !== user.id
          ),
        })
      )
    );
    const profile = await fastify.db.profiles.findOne({
      key: 'userId',
      equals: user.id,
    });
    if (profile) {
      fastify.db.profiles.delete(profile.id);
    }
    const posts = await fastify.db.posts.findMany({
      key: 'userId',
      equals: user.id,
    });
    await Promise.all(posts.map((post) => fastify.db.posts.delete(post.id)));
    return fastify.db.users.delete(id);
  }

  static async subscribeToUser(
    fastify: FastifyInstance,
    subscribeToId: string,
    userId: string
  ) {
    const user = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    return fastify.db.users.change(userId, {
      subscribedToUserIds: [...user!.subscribedToUserIds, subscribeToId],
    });
  }

  static async unsubscribeFromUser(
    fastify: FastifyInstance,
    unsubscribeFromId: string,
    userId: string
  ) {
    const user = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (user?.subscribedToUserIds.findIndex((id) => userId) === -1) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.users.change(userId, {
      subscribedToUserIds: user!.subscribedToUserIds.filter(
        (id) => id !== unsubscribeFromId
      ),
    });
  }

  static async updateUser(
    fastify: FastifyInstance,
    userId: string,
    changeUserDto: ChangeUserDTO
  ) {
    const user = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (!user) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.users.change(userId, changeUserDto);
  }
}
