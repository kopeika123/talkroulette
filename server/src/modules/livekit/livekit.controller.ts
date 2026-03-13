import { Body, Controller, Post } from '@nestjs/common';
import { CreateLivekitTokenDto } from './dto/create-livekit-token.dto';
import { LivekitTokenService } from './livekit-token.service';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitTokenService: LivekitTokenService) {}

  @Post('token')
  createToken(@Body() body: CreateLivekitTokenDto) {
    return this.livekitTokenService.createToken(body ?? {});
  }
}
