import { LikeRepository } from '../repositories/likeRepository.ts';

export class LikeService {
  constructor(private readonly repository = new LikeRepository()) {}

  getLikes() {
    return this.repository.findAll();
  }

  async createLike(reviewId: number, userId: number) {
    if (await this.repository.findByReviewAndUser(reviewId, userId)) throw new Error('LIKE_ALREADY_EXISTS');
    return this.repository.create(reviewId, userId);
  }

  async deleteLike(reviewId: number, userId: number) {
    const like = await this.repository.remove(reviewId, userId);
    if (!like) throw new Error('LIKE_NOT_FOUND');
    return like;
  }
}