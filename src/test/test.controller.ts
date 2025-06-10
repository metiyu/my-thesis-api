import { Controller, Get, Logger } from '@nestjs/common';

@Controller('test')
export class TestController {
    private readonly logger = new Logger(TestController.name);

    @Get()
    getTest() {
        this.logger.log('[TestController] Test endpoint accessed');
        return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
    }

    @Get('protected')
    getProtectedTest() {
        this.logger.log('[TestController] Protected test endpoint accessed');
        return { message: 'Protected endpoint working', timestamp: new Date().toISOString() };
    }
}
