import {Component} from '@angular/core';
import {Projekt} from "./project";
import {HibernateService} from "./hibernate.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HibernateService]
})
export class AppComponent {
  projekte: Array<Projekt> = [];

  constructor(private hibernate: HibernateService) {
    this.projekte = [];
    this.hibernate.list(Projekt).subscribe(response => this.projekte = response);
  }
}
