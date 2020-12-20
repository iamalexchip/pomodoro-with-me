import { Field, ArgsType, InputType } from "type-graphql";

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
  column?: string;
  
  @Field({ nullable: true })
  position?: number;
  
  @Field({ nullable: true })
  title?: string;
}
