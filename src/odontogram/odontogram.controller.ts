import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OdontogramService } from './odontogram.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserThrottlerGuard } from 'src/auth/user-throttler.guard';

@UseGuards(JwtAuthGuard, UserThrottlerGuard)
@Controller('odontograms')
export class OdontogramController {
  constructor(private readonly odontogramService: OdontogramService) {}
  
  @Get('/preview/:patientID')
  getPreview(@Param('patientID') patientID: string) {
    return this.odontogramService.preview(+patientID);
  }

  @Get(':patientID')
  findAll(@Param('patientID') patientID: string) {
    return this.odontogramService.findAll(+patientID);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.odontogramService.findOne(+id);
  // }

  // @Post()
  // create(@Body() createOdontogramDto: CreateOdontogramDto) {
  //   return this.odontogramService.create(createOdontogramDto);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: {toothSectionId: number, localStatus: string}[]) {
    return this.odontogramService.update(+id, body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.odontogramService.remove(+id);
  // }
}
