# Step 0: Extensions

This is a list of useful extensions:

- EditorConfig for VS Code
  ```
  # EditorConfig is awesome: https://EditorConfig.org

  # top-most EditorConfig file
  root = true

  [*]
  indent_style = space
  indent_size = 2
  end_of_line = lf
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  ```
- ESLint
- JavaScript and TypeScript Nightly
- Prettier - Code Formatter

ESLint and Prettier rules of @nestjs sometimes are pretty strict so with these extensions it helps.

If you get ESLint or Prettier errors use:

  `ctrl + shift + p`\
  `ESLint: Fix all auto-fixable Problems`

# Step 1: Setting Up

  `apt install nodejs`\
  `apt install npm`\
  `npm i -g @nestjs/cli`

After installing everything you can create your project.\
Using --skip-git is useful if you want to upload to GitHub without creating merge conflicts.
  
  `nest new app --skip-git`

# Step 2: Environment Variables

  `npm install @nestjs/config`

You're gonna pass the environment variables from the docker-compose.yml to your @nestjs
project.

```
  src/app.module.ts

  1 :  import { Module } from '@nestjs/common';
  2 :  import { ConfigModule } from '@nestjs/config';
  3 :  import { AppController } from './app.controller';
  4 :  import { AppService } from './app.service';
  5 :  
  6 :  @Module({
  7 :    imports: [
  8 :      ConfigModule.forRoot({
  9 :        isGlobal: true,
  10:      }),
  11:    ],
  12:    controllers: [AppController],
  13:    providers: [AppService],
  14:  })
  15:  export class AppModule {}
```

```
  src/env/env.d.ts

  1 :  declare global {
  2 :    namespace NodeJS {
  3 :      interface ProcessEnv {
  4 :        POSTGRES_USER: string;
  5 :        POSTGRES_PASSWORD: string;
  6 :        POSTGRES_DB: string;
  7 :        POSTGRES_HOST_PORT: string;
  8 :      }
  9 :    }
  10:  }
  11:  
  12:  export {};
```

```
Tree:

src
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  ├── env
  │   └── env.d.ts
  └── main.ts
```


And now you can call the env with type safety, using 'process.env.'
You just need to set the envs on your 'src/env/env.d.ts'

Example:
```
  console.log(process.env.POSTGRES_HOST_PORT);
  console.log(process.env.POSTGRES_USER);
```

# Step 3: Config (Environment) Schema Validation

  `npm install @hapi/joi`\
  `npm install -D @types/hapi__joi`

This is to make sure you are passing the required environments.\
Sometimes you may forget to pass environments, this will give an error if you don't pass
all the required enviroments.

```
  src/env/env.schema.ts

  1 :  import * as joi from '@hapi/joi';
  2 :  
  3 :  export const envValidationSchema = joi.object({
  4 :    POSTGRES_USER: joi.string().required(),
  5 :    POSTGRES_PASSWORD: joi.string().required(),
  6 :    POSTGRES_DB: joi.string().required(),
  7 :    POSTGRES_HOST_PORT: joi.string().required(),
  8 :  
  9 :    ENVIRONMENT: joi.string().required(),
  10:  });
```

```
  src/app.module.ts

  1 :  import { Module } from '@nestjs/common';
  2 :  import { ConfigModule } from '@nestjs/config';
  3 :  import { TypeOrmModule } from '@nestjs/typeorm';
  4 :  import { AppController } from './app.controller';
  5 :  import { AppService } from './app.service';
  7 :  import { envValidationSchema } from './env/env.schema';
  8 :  
  9 :  @Module({
  10:    imports: [
  11:      ConfigModule.forRoot({
  12:        isGlobal: true,
  13:        validationSchema: envValidationSchema,
  14:      }),
  16:    ],
  17:    controllers: [AppController],
  18:    providers: [AppService],
  19:  })
  20:  export class AppModule {}
```

```
Tree:

src
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  ├── env
  │   ├── env.d.ts
  │   └── env.schema.ts
  └── main.ts
```

# Step 4: Database Configuration

  `npm install typeorm@0.2.45 @nestjs/typeorm@8.0.3`
  `npm install pg`

We need to connect to our Postgres database. To do so, we use typeorm.

We use synchronize: true instead of false.\
This is because we are only allowed to do 'docker-compose up', cannot set the migrations manually, even though we could do in the code startup.

In production mode, it's good habit to leave it false, and use migrations instead.
We have migrations set but we're not using them.

We use forRootAsync() instead of forRoot() because in that way we can to consume dependency injection.

```
  src/config/typeorm.config.ts

  1 :  import {
  2 :    TypeOrmModuleAsyncOptions,
  3 :    TypeOrmModuleOptions,
  4 :  } from '@nestjs/typeorm';
  5 :  
  6 :  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  7 :    imports: [],
  8 :    inject: [],
  9 :    useFactory: async (): Promise<TypeOrmModuleOptions> => {
  10:      return {
  11:        logging: true,
  12:  
  13:        type: 'postgres',
  14:        host: 'postgres',
  15:        port: parseInt(process.env.POSTGRES_HOST_PORT),
  16:        username: process.env.POSTGRES_USER,
  17:        password: process.env.POSTGRES_PASSWORD,
  18:        database: process.env.POSTGRES_DB,
  19:        synchronize: true,
  20:        entities: [__dirname + '/../modules/**/entities/*.entity.js'],
  21:        migrations: [__dirname + '/../migrations/*{.ts, .js}'],
  22:        migrationsTableName: 'migrations',
  23:        cli: {
  24:          migrationsDir: __dirname + '/../migrations',
  25:        },
  26:      };
  27:    },
  28:  };
```

```
  src/app.module.ts

  1 :  import { Module } from '@nestjs/common';
  2 :  import { ConfigModule } from '@nestjs/config';
  3 :  import { TypeOrmModule } from '@nestjs/typeorm';
  4 :  import { AppController } from './app.controller';
  5 :  import { AppService } from './app.service';
  6 :  import { typeOrmAsyncConfig } from './config/typeorm.config';
  7 :  import { envValidationSchema } from './env/env.schema';
  8 :  
  9 :  @Module({
  10:    imports: [
  11:      ConfigModule.forRoot({
  12:        isGlobal: true,
  13:        validationSchema: envValidationSchema,
  14:      }),
  15:      TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  16:      UserModule,
  17:    ],
  18:    controllers: [AppController],
  19:    providers: [AppService],
  20:  })
  21:  export class AppModule {}
```

```
Tree:

src
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  ├── config
  │   └── typeorm.config.ts
  ├── env
  │   ├── env.d.ts
  │   └── env.schema.ts
  └── main.ts
```