/**
 * @description
 * DBに格納するダミーデータを作成するためのジェネレータを定義する
 * テストおよびシーディングで利用する
 * https://github.com/thoughtbot/fishery
 */

import { faker } from "@faker-js/faker";
import type { PostModel } from "db/schemas/posts";
import { type UserModel, roleEnum } from "db/schemas/users";
import { Factory } from "fishery";
import { nanoid } from "nanoid";

export const userFixture = Factory.define<UserModel>(() => {
  return {
    id: nanoid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    hashedPassword: faker.internet.password(),
    role: faker.datatype.boolean(0.95) ? roleEnum[1] : roleEnum[0],
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  };
});

export const postFixture = Factory.define<PostModel>(() => {
  return {
    id: nanoid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(3),
    public: faker.datatype.boolean(0.5),
    authorId: userFixture.build().id,
    // 単体テストの平易化のため、createdAtとupdatedAtは固定値を設定している
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  };
});

export const postInputFixture = Factory.define<Omit<PostModel, "id" | "userId" | "createdAt" | "updatedAt">>(() => {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(3),
    public: faker.datatype.boolean(0.5),
    authorId: userFixture.build().id,
  };
});
