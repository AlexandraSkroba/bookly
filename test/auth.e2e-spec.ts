import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    authorizeUser: jest.fn(),
    signUpUser: jest.fn(),
    confirmUser: jest.fn(),
    resetPassword: jest.fn(),
    setNewPassword: jest.fn(),
    recoverPassword: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth (POST) - signIn', async () => {
    const credentials = { username: 'testuser', password: 'testpassword' };
    authService.authorizeUser.mockResolvedValue({ token: 'mockToken' });

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send(credentials)
      .expect(201);

    expect(response.body).toEqual({ token: 'mockToken' });
    expect(authService.authorizeUser).toHaveBeenCalledWith(credentials);
  });

  it('/auth/signup (POST) - signUp', async () => {
    const newUser = { username: 'newuser', password: 'newpassword', email: 'email@example.com' };
    authService.signUpUser.mockResolvedValue({ id: 1, ...newUser });

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual({ id: 1, ...newUser });
    expect(authService.signUpUser).toHaveBeenCalledWith(newUser);
  });

  it('/auth/confirm/:token (GET) - confirmEmail', async () => {
    const token = 'mockToken';
    authService.confirmUser.mockResolvedValue({ message: 'Email confirmed' });

    const response = await request(app.getHttpServer())
      .get(`/auth/confirm/${token}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'Email confirmed' });
    expect(authService.confirmUser).toHaveBeenCalledWith(token);
  });

  it('/auth/reset-password (GET) - passwordRecovery', async () => {
    const token = 'mockResetToken';
    authService.resetPassword.mockResolvedValue({ message: 'Password reset' });

    const response = await request(app.getHttpServer())
      .get('/auth/reset-password')
      .query({ token })
      .expect(200);

    expect(response.body).toEqual({ message: 'Password reset' });
    expect(authService.resetPassword).toHaveBeenCalledWith(token);
  });

  it('/auth/new-password (POST) - setNewPassword', async () => {
    const resetParams = { token: 'resetToken', newPassword: 'newSecurePassword' };
    authService.setNewPassword.mockResolvedValue({ message: 'Password updated' });

    const response = await request(app.getHttpServer())
      .post('/auth/new-password')
      .send(resetParams)
      .expect(201);

    expect(response.body).toEqual({ message: 'Password updated' });
    expect(authService.setNewPassword).toHaveBeenCalledWith(resetParams);
  });

  it('/auth/recover-password (POST) - recoverPassword', async () => {
    const recoverParams = { email: 'email@example.com' };
    authService.recoverPassword.mockResolvedValue({ message: 'Recovery email sent' });

    const response = await request(app.getHttpServer())
      .post('/auth/recover-password')
      .send(recoverParams)
      .expect(201);

    expect(response.body).toEqual({ message: 'Recovery email sent' });
    expect(authService.recoverPassword).toHaveBeenCalledWith(recoverParams);
  });
});
