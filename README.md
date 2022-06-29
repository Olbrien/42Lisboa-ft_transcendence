## Useful Links:

### Docker:

[Docker Hub](https://hub.docker.com)\
[Dockerfile Instructions](https://www.fosstechnix.com/dockerfile-instructions/)\
[Docker Compose Specifications](https://docs.docker.com/compose/compose-file/)

### Nestjs:

[Dockerize NestJS](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)\
[NestJS Dockerized | Simple NestJS Starter dockerized](https://www.youtube.com/watch?v=BrlQthcUHGw)\
[NestJS with Postgres Dockerized (w/compose)](https://www.youtube.com/watch?v=jYFyLLqvHy8)\
[Nest CLI](https://docs.nestjs.com/cli/overview)

[TypeORM](https://docs.nestjs.com/techniques/database)\
[Configuration](https://docs.nestjs.com/techniques/configuration)

[NestJs Course for Beginners - Create a REST API](https://www.youtube.com/watch?v=GHTA143_b-s)

# NestJS

NestJS Structure:

                      ***************************************************************************
                      *                               Server                                    *
                      ***************************************************************************
                      *               *            *                 *           *              *
    ************      *  Validate Da- * Make sure  * Route the req-  * Run some  * Acess a dat- *
    * Request  * ---> *  ta contained * the user   * uest to a part- * business  * abase        *
    ************      *  in the requ- * is authen- * icular function * logic     *              *
                      *  est          * ticated    *                 *           *              *
    ************      *               *            *                 *           *              *
    * Response * <--- *    [Pipe]     *  [Guard]   *  [Controller]   * [Service] * [Repository] *
    ************      *               *            *                 *           *              *
                      ***************************************************************************
                      *      ---->    *    ---->   *     ----->      *   ---->   *              *
                      ***************************************************************************

Parts of NestJS:

- Controllers: Handles incoming requests.
- Services: Handles data access and business logic.
- Modules: Groups together code.
- Pipes: Validates incoming data.
- Filters: Handles errors that occur during request handling.
- Guards: Handles authentication.
- Interceptors: Adds extra logic to incoming requests or outgoing responses.
- Repositories: Handles data stored in a DB.


## Controllers

Request:

```
  POST /messages/12345?validate=true HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json
  {
      "content": "hi there!";
  }
```

```
  @Param('id')                 is 12345
  @Query()                     is validate=true
  @Headers()                  are Host / Content-Type
  @Body()                      is "content": "hi there!";
```



# Extensions

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

# Setting Up

  `apt install nodejs`\
  `apt install npm`\
  `npm i -g @nestjs/cli`

After installing everything you can create your project.\
Using --skip-git is useful if you want to upload to GitHub without creating merge conflicts.

  `nest new app --skip-git`

# Environment Variables

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

# Config (Environment) Schema Validation

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

# Database Configuration

  `npm install typeorm@0.2.45 @nestjs/typeorm@8.0.3`\
  `npm install pg`

We need to connect to our Postgres database. To do so, we use typeorm.

We use synchronize: true instead of false.\
This is because we are only allowed to do 'docker-compose up', cannot set the migrations manually, even though we could do in the code startup.

In production mode, it's good habit to leave it false, and use migrations instead.
We have migrations set but we're not using them.

We use forRootAsync() instead of forRoot() because in that way we can use dependency injection.

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

# Setting Migrations

  `npm install ts-node@10.7.0`

Even though we're setting migrations we won't be using it.\
We have 'synchronize: true', instead of 'synchronize: false'.\
It means that each change we do in our files, it will change the tables automatically.

To use migrations, you need to change 'synchronize:true' to 'synchronize:false'.

Also you need to create a 'typeorm.config-migrations.ts', because package.json will need
this TypeOrmModuleOptions

```
  src/modules/user/entities/user.entity.ts

  1 :  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  2 :
  3 :  @Entity()
  4 :  export class User {
  5 :    @PrimaryGeneratedColumn()
  6 :    id: number;
  7 :
  8 :    @Column()
  9 :    firstName: string;
  10:
  11:    @Column()
  12:    lastName: string;
  13:
  14:    @Column()
  15:    isActive: boolean;
  16:  }
```

```
  src/config/typeorm.config-migrations.ts

  1 :  import { TypeOrmModuleOptions } from '@nestjs/typeorm';
  2 :
  3 :  const typeOrmConfig: TypeOrmModuleOptions = {
  4 :      logging: process.env.DEBUG === 'true', // if DEBUG === true then this is true.
  5 :
  6 :    type: 'postgres',
  7 :    host: 'postgres',
  8 :    port: parseInt(process.env.POSTGRES_HOST_PORT),
  9 :    username: process.env.POSTGRES_USER,
  10:    password: process.env.POSTGRES_PASSWORD,
  11:    database: process.env.POSTGRES_DB,
  12:    synchronize: false,
  13:    entities: [__dirname + '/../modules/**/entities/*.entity.js'],
  14:    migrations: [__dirname + '/../migrations/*{.ts, .js}'],
  15:    migrationsTableName: 'migrations',
  16:    cli: {
  17:      migrationsDir: __dirname + '/../migrations',
  18:    },
  19:  };
  20:
  21:  export default typeOrmConfig;
```

```
  package.json

  {
    (...)

    scripts": {
      (...)

      "migration:generate": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --config src/config/typeorm.config-migrations.ts migration:generate -d ./src/migrations -n",
      "migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --config src/config/typeorm.config-migrations.ts migration:create -d ./src/migrations -n",
      "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --config src/config/typeorm.config-migrations.ts migration:run",
      "migration:revert": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --config src/config/typeorm.config-migrations.ts migration:revert"
    }
  }
```

```
Tree:

src
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  ├── config
  |   ├── typeorm.config-migrations.ts
  │   └── typeorm.config.ts
  ├── env
  │   ├── env.d.ts
  │   └── env.schema.ts
  └── main.ts
  ├── migrations
  │   └── 1655331240879-alooo.ts
  └── modules
      └── user
          ├── entities
          │   └── user.entity.ts
          └── user.module.ts
```



All commands have to be ran inside the docker nestjs.\
`docker exec -it nestjs bash`

```
  Create:   npm run migration:create 'name'
            Creates a new empty migration file.
  Generate: npm run migration:generate 'name'
            Creates a new migration based on your entities and your migration files.
  Run:      npm run migration:run
            Runs all pending migrations.
  Show:     npm run migration:show
            Shows all migrations and whether they have been run or not.
  Revert:   npm run migration:revert
            Reverts last executed migration.
```

# DTOs (Data Transfer Objects)

A data transfer object is an object that carries data between processes.

- DTO doesn't have expect for storage, retrievel, serialization and deserialization of
it's own data.
- Can be defined using an interface or class. Recommended use is class accordingly to
NestJS documentation.
- Not mandatory, but should be used always.

```
  create-logger.dto.ts:

  1:  export class CreateTaskDto {
  2:      title: string;
  3:      description: string;
  4:  }
```

```
  logger.controller.ts:

  1:  @Controller('tasks')
  2:  export class TasksController {
  3:    constructor(private tasksService: TasksService) {}
  4:    @Post()
  5:    createTask(@Body() createTaskDto: CreateTaskDto): Task {
  6:      return this.tasksService.createTask(createTaskDto);
  7:    }
  8:  }
```

```
Tree:

src
├── app.module.ts
├── main.ts
└── logger
    ├── logger.module.ts
    ├── logger.redirection.ts
    ├── logger.controller.ts
    └── dto
        └──create-logger.dto.ts
```


# Dependency Injection

Dependencies are services or objects that a class needs to perform its function.\
Dependency injection, or DI, is a design pattern in which a class requests dependencies
from external sources rather than creating them.

We have our NestJS Structure:

  Controller --->  Service ---> Repository

The Controller depends on the Service, in which the Service depends on the Repository.\
To have the object of the Service in your Controller you need to inject it first.

```
  src/messages/messages.module.ts:

  import { Module } from '@nestjs/common';
  import { MessagesController } from './messages.controller';
  import { MessagesRepository } from './messages.repository';
  import { MessagesService } from './messages.service';

  @Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  })
  export class MessagesModule {}
```

```
  src/messages/messages.controller.ts:

  1 :  import { MessagesService } from './messages.service';
  2 :
  3 :  @Controller('messages')
  4 :  export class MessagesController {
  5 :    constructor(public messagesService: MessagesService) {}
  6 :
  7 :    @Get()
  8 :    listMessages() {
  9 :      return this.messagesService.findAll();
  10:    }
  11:
  12:    @Post()
  13:    createMessage(@Body() body: CreateMessageDto) {
  14:      const { content } = body;
  15:      return this.messagesService.create(content);
  16:    }
  17:  }
```

```
  src/messages/messages.service.ts:

  1 :  import { Injectable } from '@nestjs/common';
  2 :  import { MessagesRepository } from './messages.repository';
  3 :
  4 :  @Injectable()
  5 :  export class MessagesService {
  6 :     onstructor(public messagesRepo: MessagesRepository) {}
  7 :
  8 :     findAll() {
  9 :        return this.messagesRepo.findAll();
  10:     }
  11:
  12:     create(content: string) {
  13:        return this.messagesRepo.create(content);
  14:     }
  15:  }
```

```
  src/messages/messages.repository.ts:

  1 :  import { Injectable } from '@nestjs/common';
  2 :  import { readFile, writeFile } from 'fs/promises';
  3 :
  4 :  @Injectable()
  5 :  export class MessagesRepository {
  6 :    async findAll() {
  7 :      const contents = await readFile('messages.json', 'utf8');
  8 :      const messages = JSON.parse(contents);
  9 :
  10:      return messages;
  11:    }
  12:
  13:    async create(content: string) {
  14:      const contents = await readFile('messages.json', 'utf8');
  15:      const messages = JSON.parse(contents);
  16:
  17:      const id = Math.floor(Math.random() * 999) + 1;
  18:
  19:      messages[id] = {
  20:        id: id,
  21:        content: content,
  22:      };
  23:
  24:      await writeFile('messages.json', JSON.stringify(messages));
  25:    }
  26:  }
```

# Pipes

  `npm install class-validator`\
  `npm install class-transformer`

- Pipes operate on the arguments to be processed by the route handler, before the
handler is called.
- Can perform data transformation or data validation.
- Can throw exceptions.
- Pipes can be asynchronous.

## Handler-level pipes:

```
  This pipe will process all parameters for the incoming requests.

    1:  @Post()
    2:  @UsePipes(SomePipe)
    3:  createTask(
    4:      @Body('description') description
    5:  ) {
    6:      // code
    7:  }
```

## Parameter-level pipes:

```
  Only the specified parameter will be processed.

    1:  @Post()
    2:  createTask(
    3:      @Body('description', SomePipe) descrption
    4:  ) {
    5:      // code
    6:  }
```

## Global pipes (We mainly use these):

```
  Defined at application level and will be applied to any incoming request.

    main.ts:

    1:  async function bootstrap() {
    2:      const app = await NestFactory.create(ApplicationModule);
    3:      app.useGlobalPipes(SomePipe);
    4:      await app.listen(3000);
    5:  }
    6:  bootstrap();

    src/modules/tasks/dto/create-task.dto.ts:

    1:  import { IsNotEmpty } from 'class-validator';
    2:
    3:  export class CreateTaskDto {
    4:    @IsNotEmpty()
    5:    title: string;
    6:
    7:    @IsNotEmpty()
    8:    description: string;
    9:  }
```

## Explanation:

You have your handler @Get, @Post whatever it may be. The client sends a request with
parameters, body, queries, whatever.\
But you want only the parameter description to be of string, the parameter id to be of
numbers.\
That's what pipes do, they check the arguments, and sees if they are correct.\
If they are correct they are successful and  sends the correct response, if not they send
another response.


## Using it:

First you need to install class-validator and class-transformer.\
It is requested by the global pipes to install it.\
`npm install class-validator`\
`npm install class-transformer`

You need to set global pipes.

```
  main.ts:

  1:  async function bootstrap() {
  2:      const app = await NestFactory.create(ApplicationModule);
  3:      app.useGlobalPipes(new ValidationPipe());
  4:      await app.listen(3000);
  5:  }
  6:  bootstrap();
```

Then create a new folder inside the module you want to use global pipes, folder is called\
'dtos'.

Inside that folder you can create a file name 'create-messages.dto.ts'.

```
  src/messages/dtos/create-messages.dto.ts:

  1:  import { IsString } from 'class-validator';
  2:
  3:  export class CreateMessageDto {
  4:    @IsString()
  5:    content: string;
  6:  }
```

Now you just need to set it to the controller param.

```
  src/messages/messages.controller.ts:

  1 :  import { Body, Controller, Get, Param, Post } from '@nestjs/common';
  2 :  import { CreateMessageDto } from './dtos/create-messages.dto';
  3 :
  4 :  @Controller('messages')
  5 :  export class MessagesController {
  6 :    @Post()
  7 :    createMessage(@Body() body: CreateMessageDto) {
  8 :      console.log(body);
  9 :    }
  10:  }
```

# Hash:

    https://emn178.github.io/online-tools/sha256.html

Password hashing is used to verify the integrity of your password, sent during login, against the stored hash so that your actual password never has to be stored.\
You insert your password '123456' it will give an hash '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'.\
When you login with your account, you give the password '123456' and it will save not your password, but the has of that password.

The problem is that, if you hash the password '123456' the hash will ALWAYS be '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'.\
The problem here, is that, even though the password has a long weird combination, there is something called Rainbow Table.\
Rainbow Table, is a database that has all hashes for any common password, meaning hashing is not completely safe.


## Salt:

  `npm install bcrypt`

A cryptographic salt is made up of random bits added to each password instance before its hashing.\
It means, that your password is '123456', the Salt, will add random characters before your password.\
You insert '123456' but in reality it will be something like 'a\1X<23_123456'.\
It makes your password much more secure this way.


```
  1 :  import * as bcrypt from 'bcrypt';
  2 :
  3 :  @EntityRepository(User)
  4 :  export class UsersRepository extends Repository<User> {
  5 :    async createUser(): Promise<void> {
  6 :      const password = '123456'
  7 :
  8 :      const salt = await bcrypt.genSalt();
  9 :      const hashedPassword = await bcrypt.hash(password, salt);
  10:
  11:      const newUser = this.create({
  12:        username: username,
  13:        password: hashedPassword,
  14:      });
  15:
  16:       await this.save(newUser);
  27:
  28:    }
  29:  }

  Output: $2b$10$cfs7LObX4YJyiS8kOnmLMuSs/cAsis4HoNJuRpI3QRNWviFE2PRZm
```

```
  1 :  import * as bcrypt from 'bcrypt';
  2 :
  3 :  @Injectable()
  4 :  export class AuthService {
  5 :    constructor(
  6 :      @InjectRepository(UsersRepository)
  7 :      private usersRepository: UsersRepository,
  8 :    ) {}
  9 :
  10:    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
  11:      const { username, password } = authCredentialsDto;
  12:
  13:      const user = await this.usersRepository.findOne({ username });
  14:
  15:      if (user && (await bcrypt.compare(password, user.password))) {
  16:        return 'Success';
  17:      } else {
  18:        throw new UnauthorizedException(
  19:          'Please check in your login credentials!',
  20:        );
  21:      }
  22:    }
  23:  }
```

# JSON Web Tokens (JWT):

  `npm install @nestjs/jwt`\
  `npm install @nestjs/passport`\
  `npm install passport`\
  `npm install passport-jwt`\
  `npm install @types/passport-jwt`

A JSON web token (JWT) is a URL-safe method of transferring claims between two parties.\
The JWT encodes the claims in JavaScript object notation and optionally provides space for a signature or full encryption.

JWTs can be used in various ways:

- Authentication: When a user successfully logs in using their credentials, an ID token
is returned. According to the OpenID Connect (OIDC) specs, an ID token is always a
JWT.

- Authorization: Once a user is successfully logged in, an application may request
to access routes, services, or resources (e.g., APIs) on behalf of that user. To do
so, in every request, it must pass an Access Token, which may be in the form of a JWT.
Single Sign-on (SSO) widely uses JWT because of the small overhead of the format,
and its ability to easily be used across different domains.


```
  src/auth/auth.module.ts:

  1 :  import { PassportModule } from '@nestjs/passport';
  2 :  import { JwtModule } from '@nestjs/jwt';
  3 :
  4 :  @Module({
  5 :    imports: [
  6 :      PassportModule.register({ defaultStrategy: 'jwt' }),
  7 :      JwtModule.register({
  8 :        secret: 'topsecret123',
  9 :        signOptions: {
  10:          expiresIn: 3600,
  11:        },
  12:      }),
  13:      TypeOrmModule.forFeature([UsersRepository]),
  14:    ],
  15:    providers: [AuthService],
  16:    controllers: [AuthController],
  17:  })
  18:  export class AuthModule {}
```

```
  src/auth/auth.module.ts:

  1:  export interface JwtPayload {
  2:    username: string;
  3:  }
```

```
  src/auth/auth.service.ts:

  1 :  import * as bcrypt from 'bcrypt';
  2 :  import { JwtService } from '@nestjs/jwt';
  3 :  import { JwtPayload } from './jwt-payload.interface';
  4 :
  5 :  @Injectable()
  6 :  export class AuthService {
  7 :  constructor(
  8 :      @InjectRepository(UsersRepository)
  9 :      private usersRepository: UsersRepository,
  10:      private jwtService: JwtService,
  11:  ) {}
  12:
  13:  async signIn(
  14:      authCredentialsDto: AuthCredentialsDto,
  15:  ): Promise<{ accessToken: string }> {
  16:      const { username, password } = authCredentialsDto;
  17:
  18:      const user = await this.usersRepository.findOne({ username });
  19:
  20:      if (user && (await bcrypt.compare(password, user.password))) {
  21:      const payload: JwtPayload = { username };
  22:      const accessToken: string = await this.jwtService.sign(payload);
  23:
  24:      return { accessToken };
  25:      } else {
  26:         throw new UnauthorizedException(
  27:          'Please check in your login credentials!',
  28:         );
  29:      }
  30:    }
  31:  }
```

```
  Output: { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpc2FudG9zc3MiLCJpYXQiOjE2NTU1MTM5NTgsImV4cCI6MTY1NTUxNzU1OH0.HILaYwIwUfcMgz4MXU6wQ_DsdKyte5Dp7ZOYbG3tF-Q" }
```

# Logging

When something goes wrong we need a way to know what happened, when it happened, why
it happened.

There are different types of logs:

- Log:      General Purpose.
- Warning:  Handling issues that are not fatal or destructive.
- Error:    Handling issues that are fatal or destructive.
- Debug:    Useful information that can help us debug the logic in case of
            error / warning.
- Verbose:  Usually "Too much information". Useful for to know the insights.

```
  main.ts:

  1 :  import { ValidationPipe } from '@nestjs/common';
  2 :  import { NestFactory } from '@nestjs/core';
  3 :  import { AppModule } from './app.module';
  4 :  import { Logger } from '@nestjs/common';
  5 :
  6 :  async function bootstrap() {
  7 :    const logger = new Logger('Main', { timestamp: true });
  8 :
  9 :    const app = await NestFactory.create(AppModule);
  10:
  11:    const port = 3000;
  12:    await app.listen(port);
  13:
  14:    logger.log(`Application listening on port = ${port}`);
  15:  }
  16:  bootstrap();
```

```
  /src/modules/tasks/tasks.controller.ts:

  1 :  import { Logger} from '@nestjs/common';
  2 :
  3 :  @Controller('tasks')
  4 :  @UseGuards(AuthGuard())
  5 :  export class TasksController {
  6 :    private logger = new Logger('TasksController', { timestamp: true });
  7 :
  8 :    constructor(private tasksService: TasksService) {}
  9 :
  10:    @Get()
  11:    getTasks(
  12:      @Query() filterDto: GetTaskFilterDto,
  13:      @GetUser() user: User,
  14:    ): Promise<Task[]> {
  15:      this.logger.verbose(
  16:        `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
  17:          filterDto,
  18:        )}`,
  19:      );
  20:      return this.tasksService.getTasks(filterDto, user);
  21:    }
  22:  }
```

```
  /src/modules/tasks/repository/task.repository.ts

  1 :  import { Logger } from '@nestjs/common';
  2 :
  3 :  @EntityRepository(Task)
  4 :  export class TaskRepository extends Repository<Task> {
  5 :    private logger = new Logger('TasksRepository', { timestamp: true });
  6 :
  7 :    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
  8 :
  9 :      (...)
  10:
  11:      try {
  12:        const tasks = await query.getMany();
  13:        return tasks;
  14:      } catch (error) {
  15:        this.logger.error(
  16:          `Failed to get task for user ${user.username}`,
  17:          error.stack,
  18:        );
  19:        throw new InternalServerErrorException();
  20:      }
  21:    }
  22:  }
```

# Serialization:

Serialization is a process that happens before objects are returned in a network
response. This is an appropriate place to provide rules for transforming and sanitizing
the data to be returned to the client. For example, sensitive data like passwords should
always be excluded from the response. Or, certain properties might require additional
transformation, such as sending only a subset of properties of an entity.

Example:

    You want to request @GET an ID that has the email, name and password.
    You don't want to show the password, you want to be hidden and not being sent.
    That's what serialization is.

## Interceptor:

Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented
Programming (AOP) technique. They make it possible to:

- Bind extra logic before / after method execution
- Transform the result returned from a function
- Transform the exception thrown from a function
- Extend the basic function behavior
- Completely override a function depending on specific conditions (e.g., for
  caching purposes)


## Custom Interceptor (Hide password):

```
  src/users/user.entity.ts:

  // This creates the entity (table)

  1 :  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  2 :
  3 :  @Entity()
  4 :  export class User {
  5 :    @PrimaryGeneratedColumn()
  6 :    id: number;
  7 :
  8 :    @Column()
  9 :    email: string;
  10:
  11:    @Column()
  12:    password: string;
  13:  }
```

```
  src/users/dtos/user.dto.ts:

  // This creates the dto with the data you want to expose

  1 :  import { Expose } from 'class-transformer';
  2 :
  3 :  export class UserDto {
  4 :    @Expose()
  5 :    id: number;
  6 :
  7 :    @Expose()
  8 :    email: string;
  9 :  }
```

```
  src/interceptors/serialize.interceptors.ts:

  // This creates the custom interceptor

  1 :  import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors} from '@nestjs/common';
  2 :  import { plainToInstance } from 'class-transformer';
  3 :  import { map, Observable } from 'rxjs';
  4 :
  5 :  interface ClassConstructor {        // This is for Serialize() to be of a Class only
  6 :    new (...args: any[]): unknown;
  7 :  }
  8 :
  9 :  export function Serialize(dto: ClassConstructor) {
  10:    return UseInterceptors(new SerializeInterceptor(dto));
  11:  }
  12:
  13:  export class SerializeInterceptor implements NestInterceptor {
  14:    constructor(private dto: any) {}
  15:
  16:    intercept(
  17:      context: ExecutionContext,
  18:      next: CallHandler<any>,
  19:    ): Observable<any> | Promise<Observable<any>> {
  20:      // Run something before the request is handled
  21:
  22:      return next.handle().pipe(
  23:        map((data: any) => {
  24:          // Run something before the response is sent out
  25:          return plainToInstance(this.dto, data, {
  26:            excludeExtraneousValues: true,
  27:          });
  28:        }),
  29:      );
  30:    }
  31:  }
```

```
  src/users/users.controller.ts

  // Now we add @Serialize(UserDto) to or the entire class, or Requests

  1 :  import { Body, Controller, Query } from '@nestjs/common';
  2 :  import { Serialize } from 'src/interceptors/serialize.interceptor';
  3 :  import { CreateUserDto } from './dtos/create-user.dto';
  4 :  import { UpdateUserDto } from './dtos/update-user.dto';
  5 :  import { UserDto } from './dtos/user.dto';
  6 :  import { UsersService } from './users.service';
  7 :
  8 :  @Controller('auth')
  9 :  @Serialize(UserDto) // Or here to apply to everything
  10:  export class UsersController {
  11:    constructor(private usersService: UsersService) {}
  12:
  13:    @Post('/signup')
  14:    createUser(@Body() body: CreateUserDto) {
  15:      this.usersService.create(body.email, body.password);
  16:    }
  17:
  18:    @Serialize(UserDto) // Or here to apply to single methods
  19:    @Get('/:id')
  20:    async findUser(@Param('id') id: string) {
  21:      const user = await this.usersService.findOne(parseInt(id));
  22:      if (!user) {
  23:        throw new NotFoundException('user not found');
  24:      }
  25:
  26:      return user;
  27:    }
  28:
  29:    @Serialize(UserDto) // Or here to apply to single methods
  30:    @Get()
  31:    findAllUsers(@Query('email') email: string) {
  32:      return this.usersService.find(email);
  33:    }
  34:  }
```
