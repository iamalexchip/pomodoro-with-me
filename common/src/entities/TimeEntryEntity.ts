import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";

@ObjectType({ description: "Time entry model" })
export class TimeEntry {
  @Field(() => ID)
  id: string;
  
  @Field({ nullable: true })
  @Property()
  start: Date;
  
  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  end: Date;
}