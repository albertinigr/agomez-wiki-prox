import { Type } from '@nestjs/common';

export interface IPaginatedType<T> {
  nodes: T[];
  cursor: string;
  totalCount: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  // @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    // @Field(() => [classRef], { nullable: true })
    nodes: T[];

    // @Field(() => String)
    cursor: string;

    // @Field(() => Int)
    totalCount: number;

    // @Field()
    hasNextPage: boolean;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
