<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
my-thesis-api
├─ .eslintrc.js
├─ .prettierrc
├─ api-keys-db.json
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ api-key-form.html
│  └─ image.png
├─ README.md
├─ requirements.txt
├─ scripts
│  ├─ !!prethesis (1) copy.ipynb
│  ├─ analyze_stocks.py
│  ├─ calculate_portfolio_metrics.py
│  ├─ dataset
│  │  ├─ consistent_lq45_stocks.csv
│  │  └─ summary.csv
│  ├─ download_returns.py
│  ├─ efficient_frontier.py
│  ├─ get_stock.py
│  ├─ individual_stock_analysis.py
│  ├─ monte_carlo_simulation.py
│  ├─ new
│  │  ├─ analyze_extreme_cases.py
│  │  ├─ analyze_individual_stocks.py
│  │  ├─ compare_benchmark.py
│  │  ├─ download_data.py
│  │  ├─ generate_efficient_frontier.py
│  │  ├─ monte_carlo_simulation.py
│  │  ├─ optimize_portfolio.py
│  │  ├─ statistical_test.py
│  │  └─ test_input.py
│  ├─ optimize_portfolio.py
│  └─ prethesis (1).ipynb
├─ src
│  ├─ api-key
│  │  ├─ ap-keys-db.json
│  │  ├─ api-key.middleware.spec.ts
│  │  ├─ api-key.middleware.ts
│  │  ├─ api-key.module.ts
│  │  ├─ api-key.service.spec.ts
│  │  └─ api-key.service.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.controller.spec.ts
│  │  ├─ auth.controller.ts
│  │  └─ auth.module.ts
│  ├─ main.ts
│  ├─ portfolio
│  │  ├─ dto
│  │  │  ├─ benchmark.dto.ts
│  │  │  ├─ download-data.dto.ts
│  │  │  ├─ efficient-frontier.dto.ts
│  │  │  ├─ export-result.dto.ts
│  │  │  ├─ extreme-case.dto.ts
│  │  │  ├─ individual-stock.dto.ts
│  │  │  ├─ monte-carlo-simulation-result.dto.ts
│  │  │  ├─ monte-carlo.dto.ts
│  │  │  ├─ optimize-portfolio.dto.ts
│  │  │  ├─ statistical-test-response.dto.ts
│  │  │  └─ statistical-test.dto.ts
│  │  ├─ portfolio.controller.ts
│  │  └─ portfolio.service.ts
│  ├─ python
│  │  └─ python.service.ts
│  └─ test
│     ├─ test.controller.spec.ts
│     ├─ test.controller.ts
│     └─ test.module.ts
├─ temp
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```