import { CreatePostDTO, ChangePostDTO } from './../utils/DB/entities/DBPosts';
import { FastifyInstance } from 'fastify';
// import { ChangeUserDTO, CreateUserDTO } from '../utils/DB/entities/DBPosts';

export default class PostsService {
  static getAllPosts(fastify: FastifyInstance) {
    return fastify.db.posts.findMany();
  }
  static async getPostById(fastify: FastifyInstance, id: string) {
    const post = await fastify.db.posts.findOne({
      key: 'id',
      equals: id,
    });
    if (!post) {
      throw fastify.httpErrors.notFound();
    }
    return post;
  }
  static async createPost(
    fastify: FastifyInstance,
    createPostDto: CreatePostDTO
  ) {
    return fastify.db.posts.create(createPostDto);
  }

  static async deletePost(fastify: FastifyInstance, id: string) {
    const post = await fastify.db.posts.findOne({
      key: 'id',
      equals: id,
    });
    if (!post) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.posts.delete(id);
  }

  static async updatePost(
    fastify: FastifyInstance,
    postId: string,
    changePostDto: ChangePostDTO
  ) {
    const post = await fastify.db.posts.findOne({
      key: 'id',
      equals: postId,
    });
    if (!post) {
      throw fastify.httpErrors.badRequest();
    }
    return fastify.db.posts.change(postId, changePostDto);
  }
}
