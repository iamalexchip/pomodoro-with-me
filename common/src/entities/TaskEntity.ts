import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { Session } from "./SessionEntity";
import { TimeEntry } from "./TimeEntryEntity";

@ObjectType({ description: "The Task model" })
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  @Property({ required: true, default: "" })
  title: string;

  @Field(_type => Session, { nullable: true })
  @Property({ ref: Session })
  session: Ref<Session>;

  @Field()
  @Property({ required: true })
  column: string;

  @Field()
  @Property({ required: true })
  position: number;

  @Field(_type => [TimeEntry])
  @Property({ type: [TimeEntry] })
  timesheet: TimeEntry[]

  @Field()
  createAt: Date

  @Field()
  updateAt: Date
}

export const TaskModel = getModelForClass(Task, { schemaOptions: { timestamps: true } });
