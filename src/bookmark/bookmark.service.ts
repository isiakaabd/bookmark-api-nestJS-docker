import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmark } from './dto/create-bookmark';
import { EditBookmark } from './dto';

export interface Bookmark {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  link: string;
  userId: number;
}
@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number): Promise<{ bookmarks: Bookmark[] }> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
    return { bookmarks };
  }
  async getBookmarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    bookmark: EditBookmark,
  ) {
    const data = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });
    if (!data || data.userId !== userId)
      throw new ForbiddenException('Access denied for this bookmark');
    const newBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...bookmark,
      },
    });
    return newBookmark;
  }
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const data = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });
    if (!data || data.userId !== userId)
      throw new ForbiddenException('Access denied for this bookmark');
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return {
      message: 'bookmark deleted successfully',
    };
  }
  async createBookmark(userId: number, bookmark: CreateBookmark) {
    const book = this.prisma.bookmark.create({
      data: {
        userId,
        ...bookmark,
      },
    });
    return book;
  }
}
