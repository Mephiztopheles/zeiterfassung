import {Model} from "./model";
import {Projekt} from "./project";
import {MINUTE} from "./variables";

export class StundenZettel extends Model {
  titel: string;
  beschreibung: string;
  start: Date;
  ende: Date;
  projekt: Projekt;

  public static controller = "stundenZettel";

  constructor(data: object) {
    super(data);
  }

  get dauer(): number {
    if (this.start && this.ende)
      return this.ende.getTime() - this.start.getTime();
    return 0;
  }

  protected init(): void {
    if (!this.start) {
      this.start = new Date();
    } else if (!(this.start instanceof Date)) {
      this.start = new Date(this.start);
    }
    this.start.setSeconds(0);
    this.start.setMilliseconds(0);
    if (!this.ende) {
      this.ende = new Date(this.start.getTime() + 30 * MINUTE);
    } else if (!(this.ende instanceof Date)) {
      this.ende = new Date(this.ende);
    }
    this.ende.setSeconds(0);
    this.ende.setMilliseconds(0);

    if (this.projekt && !(this.projekt instanceof Projekt)) {
      this.projekt = Projekt.get(this.projekt);
    }

  }
}
