import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { TimeEntry } from "./TimeEntryEntity";

export enum SessionStatus {
  unbegun =  'unbegun',
  pomodoro = 'pomodoro',
  break = 'break',
  done = 'done'
}

registerEnumType(SessionStatus, { name: "SessionStatus" });

@ObjectType({ description: "The Session column model" })
export class SessionColumn {
  @Field(() => ID)
  id: string;
  
  @Field()
  @Property({ required: true })
  position: number;
  
  @Field()
  @Property({ required: true })
  label: string;

  @Field()
  @Property({ required: true, default: false })
  isFocus?: boolean;
}

@ObjectType({ description: "The Session model" })
export class Session {

  @Field(() => ID)
  id: string;

  @Field()
  @Property({ required: true, unique: true })
  slug: string;

  @Field()
  @Property({ required: true, default: "" })
  name: string;

  @Field(_type => SessionStatus)
  @Property({ enum: SessionStatus, required: true, default: "unbegun" })
  status: SessionStatus

  @Field()
  @Property({ default: false })
  isModerated: boolean

  @Field()
  @Property({ default: true })
  isOpen: boolean

  @Field(_type => [TimeEntry])
  @Property({ type: [TimeEntry] })
  timesheet: TimeEntry[]

  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  end: Date
  
  @Field(_type => [SessionColumn])
  @Property({ type: [SessionColumn] })
  columns: SessionColumn[]
}

export const SessionModel = getModelForClass(Session, { schemaOptions: { timestamps: true } });
