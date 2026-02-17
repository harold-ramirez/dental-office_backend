import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PersonalPathologiesService } from './personal-pathologies.service';
import { CreatePersonalPathologyDto } from './dto/create-personal-pathology.dto';
import { UpdatePersonalPathologyDto } from './dto/update-personal-pathology.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtUser, User } from 'src/auth/user.decorator';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('personal-pathologies')
export class PersonalPathologiesController {
  constructor(
    private readonly personalPathologiesService: PersonalPathologiesService,
  ) {}

  @Get('/')
  findAll() {
    return this.personalPathologiesService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.personalPathologiesService.findOne(+id);
  }

  @Post()
  create(@Body() createPersonalPathologyDto: CreatePersonalPathologyDto, @User() user: JwtUser) {
    return this.personalPathologiesService.create(createPersonalPathologyDto, user.userID);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updatePersonalPathologyDto: UpdatePersonalPathologyDto,
  ) {
    return this.personalPathologiesService.update(
      +id,
      updatePersonalPathologyDto,
    );
  }

  @Delete('/:id')
  softDelete(@Param('id') id: string) {
    return this.personalPathologiesService.softDelete(+id);
  }
}
