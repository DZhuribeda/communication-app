import 'reflect-metadata';
import express from 'express';
import { useExpressServer } from 'routing-controllers';
import { JsonController, Get } from 'routing-controllers';

@JsonController()
export class TestController {
  @Get()
  getTest() {
    return {
      test: 'ok'
    };
  }
}

const app = express();

useExpressServer(app, {
  controllers: [TestController],
});
app.listen(5000);
console.log('App listen 5000');
