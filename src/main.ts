import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session'
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
    app.useGlobalPipes(new ValidationPipe())

    app.use(
        session({
            secret: 'secret',
            saveUninitialized: false,
            resave: false,
            cookie: {
                maxAge: 300000,
            },
        }),
    )
    app.use(passport.initialize())
    app.use(passport.session())

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    })

    const config = new DocumentBuilder()
        .setTitle('Bookly API')
        .setTitle('Bookly API')
        .setVersion('1.0.0')
        .addOAuth2()
        .addBearerAuth(
            {
                description: `Please enter token (without Bearer prefix)`,
                name: 'Authorization',
                scheme: 'Bearer',
                type: 'http', // I`ve attempted type: 'apiKey' too
                in: 'Header',
            },
            'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
