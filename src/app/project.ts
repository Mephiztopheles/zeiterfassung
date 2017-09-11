import {Model} from "./model";

export class Projekt extends Model {
  public id: number;
  public name: string;
  public static controller = "projekt";
}
