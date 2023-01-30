import { User } from './../entities/user';
import { ChangePostInput, CreatePostInput } from './../entities/post';
import { FastifyInstance } from 'fastify';
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import PostsService from '../../services/posts';
import { Post } from '../entities/post';
import { PostEntity } from '../../utils/DB/entities/DBPosts';

@Resolver((_of) => Post)
export default class PostResolver {
  @Query((_returns) => Post, { nullable: false })
  async returnSinglePost(@Ctx() ctx: FastifyInstance, @Arg('id') id: string) {
    return PostsService.getPostById(ctx, id);
  }

  @Query(() => [Post])
  async returnAllPosts(@Ctx() ctx: FastifyInstance) {
    return PostsService.getAllPosts(ctx);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('createPostInput')
    createPostInput: CreatePostInput,
    @Ctx() ctx: FastifyInstance
  ) {
    return PostsService.createPost(ctx, createPostInput);
  }

  @Mutation(() => Post)
  async changePost(
    @Arg('changePostInput')
    changePostInput: ChangePostInput,
    @Ctx() ctx: FastifyInstance
  ) {
    const { id, ...rest } = changePostInput;
    return PostsService.updatePost(ctx, id, rest);
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: string, @Ctx() ctx: FastifyInstance) {
    return PostsService.deletePost(ctx, id);
  }

  @FieldResolver((_type) => User)
  async user(@Root() Post: PostEntity, @Ctx() ctx: FastifyInstance) {
    return ctx.db.users.findOne({ key: 'id', equals: Post.userId });
  }
}
