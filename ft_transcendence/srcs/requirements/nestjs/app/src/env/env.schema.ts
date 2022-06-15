import * as joi from '@hapi/joi';

export const envValidationSchema = joi.object({
  POSTGRES_USER: joi.string().required(),
  POSTGRES_PASSWORD: joi.string().required(),
  POSTGRES_DB: joi.string().required(),
  POSTGRES_HOST_PORT: joi.string().required(),

  ENVIRONMENT: joi.string().required(),
});
