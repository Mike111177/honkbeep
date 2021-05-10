import { User } from "honkbeep-protocol/types/User";
import { xorshift32 } from "honkbeep-util/rng";

const rng = new xorshift32();

const users: User[] = [];
const nameMap = new Map<string, User>();
const idMap = new Map<number, User>();

function addUser(name: string) {
  const newUser = { name, id: rng.next() };
  users.push(newUser);
  nameMap.set(newUser.name, newUser);
  idMap.set(newUser.id, newUser);
  return newUser;
}

export function getUser(id: number): User | undefined;
export function getUser(name: string): User;
export function getUser(user: string | number) {
  switch (typeof user) {
    case "string":
      return nameMap.get(user) ?? addUser(user);
    case "number":
      return idMap.get(user);
  }
}
