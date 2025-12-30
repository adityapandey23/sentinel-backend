import {
  controller,
  httpGet,
  request,
  response
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { TestService } from "@/service/test-service.interface";

@controller("/test")
export class TestController implements interfaces.Controller {
    constructor(
        @inject(TYPES.TestServiceImpl) private testService: TestService
    ) {}

    @httpGet("/")
    private getTest(
        @request() req: Request, @response() res: Response
    ) {
        const result = this.testService.run();
        res.json({"message" : result})
    }
}
