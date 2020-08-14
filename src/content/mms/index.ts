import { ICommand } from "../rule";
import { commands as MessageCommands } from "./message";
import { commands as SubscriptionCommands } from "./subscription_helper";
import { commands as RequestIdCommands } from "./request_id";
import { commands as OperationCommands } from "./operation_id";
import { commands as TimeStampCommands } from "./timestamp";
export { MMSLinkProvider } from "./link"

export const commands: ICommand<any>[] = [...MessageCommands, ...SubscriptionCommands, ...RequestIdCommands, ...OperationCommands, ...TimeStampCommands];



