import {Component} from '@angular/core';
import {Projekt} from "./project";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  projekte: Array<Projekt> = [];

  constructor() {
    this.projekte = [new Projekt({id: 1, "name": "Test"})];
  }
}
