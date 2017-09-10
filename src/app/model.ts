export class Model {
  public id: number;
  public static controller: string;
  private static list = {};

  constructor(data: object) {
    Object.assign(this, data);
    let c = this["constructor"];
    let list = Model.list[c.name];
    if (!list)
      list = Model.list[c.name] = [];
    list.push(this);
    if (this.id === undefined) {
      this.id = null;
    }
    this.init();
  }

  protected init(): void {

  }

  public static get(data: any): any {
    if (data instanceof this) {
      return data;
    }
    return Model.list[this.name].find(it => it.id === data.id);
  }

}
