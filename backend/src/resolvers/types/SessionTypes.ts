import { Field, ArgsType } from "type-graphql";
import { Session, SessionStatus } from "../../entities/Session";

@ArgsType()
export class UpdateSessionArgs implements Partial<Session> {

  @Field()
  name: string;

  @Field()
  isOpen?: boolean;

  @Field()
  isModerated?: boolean;
}

@ArgsType()
export class ToggleSessionArgs implements Partial<Session> {

  @Field()
  name: string;

  @Field(_type => SessionStatus)
  status: SessionStatus;
}
