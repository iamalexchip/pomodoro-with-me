import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { Session } from "./Session";

@ObjectType({ description: "The Session column model" })
export class TimeEntry {
  @Field(() => ID)
  id: number;
  
  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  start: Date;
  
  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  end: Date;
}

@ObjectType({ description: "The Task model" })
export class Task {

  @Field(() => ID)
  id: number;

  @Field()
  @Property({ required: true, default: "" })
  title: string;

  @Field(_type => Session, { nullable: true })
  @Property({ ref: Session })
  session: Ref<Session>;

  @Field()
  @Property({ required: true })
  column: string;

  @Field(_type => [TimeEntry])
  @Property({ type: [TimeEntry] })
  timesheet: TimeEntry[]

  @Field()
  createAt: Date

  @Field()
  updateAt: Date
}

export const TaskModel = getModelForClass(Task, { schemaOptions: { timestamps: true } });
