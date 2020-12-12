import { InputType, Field, ID } from "type-graphql";
import { Session } from "../../models/Session";

@InputType()
export class SessionInput implements Partial<Session> {

  @Field()
  name: string;
}
