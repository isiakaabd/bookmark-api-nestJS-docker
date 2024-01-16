import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { Bookmark, BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { EditBookmark } from './dto';
import { CreateBookmark } from './dto/create-bookmark';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkservice: BookmarkService) {}

  @Get()
  async getBookmarks(
    @GetUser('id') userId: number,
  ): Promise<{ bookmarks: Array<Bookmark> }> {
    return this.bookmarkservice.getBookmarks(userId);
  }
  @Get(':id')
  async getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.bookmarkservice.getBookmarkById(userId, bookmarkId);
  }
  @Patch(':id')
  async editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmark,
  ) {
    return this.bookmarkservice.editBookmarkById(userId, bookmarkId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkservice.deleteBookmarkById(userId, bookmarkId);
  }
  @Post()
  async createBookmarkById(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmark,
  ) {
    return this.bookmarkservice.createBookmark(userId, dto);
  }
}
