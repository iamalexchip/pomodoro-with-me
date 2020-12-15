import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class CreateColumnArgs {

  @Field()
  session: string;

  @Field()
  label: string;
}

@ArgsType()
export class UpdateColumnArgs {

  @Field()
  session: string;

  @Field()
  id: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  position?: number;
  
  @Field({ nullable: true })
  isFocus?: boolean;
}

@ArgsType()
export class DeleteColumnArgs
{

  @Field()
  session: string;

  @Field()
  id: string;
}
