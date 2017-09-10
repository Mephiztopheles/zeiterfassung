/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

interface String {
  decapitalize(): string;
}

interface Date {
  clearTime(): Date;
}
