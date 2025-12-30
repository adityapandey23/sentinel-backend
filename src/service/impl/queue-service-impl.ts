import type { QueueService } from "../queue-service.interface";
import { injectable } from "inversify";

@injectable()
export class QueueServiceImpl implements QueueService {}