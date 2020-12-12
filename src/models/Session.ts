import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

@ObjectType({ description: "The Session model" })
export class Session {

    @Field(() => ID)
    id: number;  

    @Field()
    @Property({ required: true })
    name: String;
}

export const SessionModel = getModelForClass(Session);
