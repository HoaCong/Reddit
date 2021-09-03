import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePostInput {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  text: string;
}
