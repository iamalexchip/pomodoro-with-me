import { Field, ArgsType, InputType } from "type-graphql";
import { Task } from "../../entities/Task";

@ArgsType()
export class CreateTaskArgs {
  @Field()
  title: string;

  @Field()
  column: string;

  @Field()
  session: string;
}

@ArgsType()
export class UpdateTaskArgs {
  @Field()
  id: string;
  
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  column?: string;
}
