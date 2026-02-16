import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  submitContact(@Body() dto: ContactDto) {
    return this.contactService.submitContact(dto);
  }
}
