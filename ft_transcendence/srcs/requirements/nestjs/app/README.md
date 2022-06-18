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


# Pipes

  `npm install class-validator`\
  `npm install class-transformer`

- Pipes operate on the arguments to be processed by the route handler, before the
handler is called.
- Can perform data transformation or data validation.
- Can throw exceptions.
- Pipes can be asynchronous.

Handler-level pipes:

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

Parameter-level pipes:

```
  Only the specified parameter will be processed.

    1:  @Post()
    2:  createTask(
    3:      @Body('description', SomePipe) descrption
    4:  ) {
    5:      // code
    6:  }
```

Global pipes:

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

Explanation:

    You have your handler @Get, @Post whatever it may be. The client sends a request with
    parameters, body, queries, whatever.
    But you want only the parameter description to be of string, the parameter id to be of
    numbers.
    That's what pipes do, they check the arguments, and sees if they are correct.
    If they are correct they are successful and  sends the correct response, if not they send
    another response.


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
  `npm install passport-jwt`

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
