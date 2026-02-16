import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';
export declare class ContactService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private resend;
    constructor(prisma: PrismaService, configService: ConfigService);
    submitContact(dto: ContactDto): Promise<{
        success: boolean;
        message: string;
        id: any;
    }>;
    private buildEmailHtml;
    private escapeHtml;
}
