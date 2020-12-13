import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

export enum SessionStatus {
  unbegun =  'unbegun',
  pomodoro = 'pomodoro',
  break = 'break',
  done = 'done'
}

registerEnumType(SessionStatus, { name: "SessionStatus" });

@ObjectType({ description: "The Session column model" })
export class SessionColumn {
  @Field()
  @Property({ required: true })
  position: number;
  
  @Field()
  @Property({ required: true })
  label: string;
}

@ObjectType({ description: "The Session model" })
export class Session {

  @Field(() => ID)
  id: number;

  @Field()
  @Property({ required: true, unique: true })
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

  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  start: Date

  @Field({ nullable: true })
  @Property({ nullable: true, default: null })
  end: Date
  
  @Field(_type => [SessionColumn])
  @Property({ type: [SessionColumn] })
  columns: SessionColumn[] 
}

export const SessionModel = getModelForClass(Session, { schemaOptions: { timestamps: true } });
