"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const resend_1 = require("resend");
let ContactService = ContactService_1 = class ContactService {
    prisma;
    configService;
    logger = new common_1.Logger(ContactService_1.name);
    resend = null;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
        }
    }
    async submitContact(dto) {
        const adminEmail = this.configService.get('ADMIN_EMAIL') || 'admin@example.com';
        let savedMessage;
        try {
            savedMessage = await this.prisma.contactMessage.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone || null,
                    eventDate: dto.eventDate || null,
                    eventType: dto.eventType || null,
                    message: dto.message,
                },
            });
            this.logger.log(`Contact message saved with ID: ${savedMessage.id}`);
        }
        catch (error) {
            this.logger.error('Failed to save contact message to database', error);
            throw new common_1.HttpException('Failed to save message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (this.resend) {
            try {
                const htmlContent = this.buildEmailHtml(dto);
                const data = await this.resend.emails.send({
                    from: ' Fiesta Events <onboarding@resend.dev>',
                    to: [adminEmail],
                    subject: `New Contact Message from ${dto.name}`,
                    html: htmlContent,
                });
                this.logger.log(`Email sent successfully: ${data.data?.id}`);
            }
            catch (error) {
                this.logger.error('Failed to send email via Resend', error);
            }
        }
        else {
            this.logger.warn('RESEND_API_KEY not configured - email not sent');
        }
        return {
            success: true,
            message: 'Contact message received successfully',
            id: savedMessage.id,
        };
    }
    buildEmailHtml(dto) {
        const eventTypeLabels = {
            birthday: 'Kids Birthday',
            school: 'School Event',
            wedding: 'Wedding',
            corporate: 'Corporate Event',
            other: 'Other',
        };
        const eventTypeLabel = dto.eventType ? eventTypeLabels[dto.eventType] || dto.eventType : 'Not specified';
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #6b7280; font-size: 14px; text-transform: uppercase; }
    .value { font-size: 16px; color: #1f2937; }
    .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; }
    .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Contact Message</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${this.escapeHtml(dto.name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${this.escapeHtml(dto.email)}">${this.escapeHtml(dto.email)}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${dto.phone ? `<a href="tel:${this.escapeHtml(dto.phone)}">${this.escapeHtml(dto.phone)}</a>` : 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Event Date</div>
        <div class="value">${dto.eventDate || 'Not specified'}</div>
      </div>
      <div class="field">
        <div class="label">Event Type</div>
        <div class="value">${eventTypeLabel}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${this.escapeHtml(dto.message)}</div>
      </div>
    </div>
    <div class="footer">
      <p>This message was sent from your Fiesta Events contact form.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
    }
    escapeHtml(text) {
        const map = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map