import {Component, Input} from '@angular/core';
import {StundenZettel} from "../stunden-zettel";
import {HibernateService} from "../hibernate.service";
import {Projekt} from "../project";

@Component({
  selector: 'app-stundenzettel-liste',
  templateUrl: './stundenzettel-liste.component.html',
  styleUrls: ['./stundenzettel-liste.component.css'],
  providers: [HibernateService]
})
export class StundenzettelListeComponent {

  @Input()
  filter: any = {
    id: null,
    projekt: null
  };
  projects;
  stundenzettel = [];
  stundenZettelGefiltert = [];
  @Input()
  entry;
  current: StundenZettel;
  _de;

  constructor(private hibernate: HibernateService) {
    this.projects = [];
    this.projects.push(new Projekt({name: 'Test', id: 1}));
    this.projects.push(new Projekt({name: 'Support', id: 2}));
    hibernate.get(1, StundenZettel).subscribe((response: object) => {
      this.stundenzettel.push(new StundenZettel(response));
      hibernate.save(this.stundenzettel[0]);
      this.setFilter();
    });

    this._de = {
      firstDayOfWeek: 1,
      dayNames: ["Sonntag", "Montag", "Diesntag", "Mittwoch", "Donnerstag", "Dreitag", "Samstag"],
      dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      monthNamesShort: ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Ock", "Nov", "Dez"]
    }
  }

  public setFilter() {
    this.stundenZettelGefiltert = this.stundenzettel.filter(item => {
      if (this.filter.start) {
        let itemValue = new Date(item.start);
        let filterValue = new Date(this.filter.start);
        itemValue.clearTime();
        filterValue.clearTime();
        if (itemValue.getTime() < filterValue.getTime()) {
          return false;
        }
      }
      if (this.filter.ende) {
        let itemValue = new Date(item.ende);
        let filterValue = new Date(this.filter.ende);
        itemValue.clearTime();
        filterValue.clearTime();
        if (itemValue.getTime() > filterValue.getTime()) {
          return false;
        }
      }
      for (let property in this.filter) {
        if (this.filter.hasOwnProperty(property)) {
          let filterValue = this.filter[property];
          if (filterValue != null) {
            let itemValue = item[property];
            if (typeof filterValue === "object") {
              if (itemValue && itemValue.id !== filterValue.id) {
                return false;
              }
            } else if (itemValue instanceof Date) {

            } else {
              if (itemValue !== filterValue) {
                return false;
              }
            }
          }
        }
      }
      return true;
    }).sort((a, b) => a.start.getTime() > b.start.getTime() ? 1 : -1);

  }

  public edit(eintrag: StundenZettel) {
    this.entry = Object.assign({}, eintrag);
    this.current = eintrag;
    console.log(this.entry);
  }

  public save() {

    this.entry.ende.setFullYear(this.entry.start.getFullYear());
    this.entry.ende.setMonth(this.entry.start.getMonth());
    this.entry.ende.setDate(this.entry.start.getDate());

    if (this.current) {
      this.hibernate.save(this.entry);
      Object.assign(this.current, this.entry);
    } else {
      this.entry.id = this.stundenzettel.length + 1;
      this.stundenzettel.push(new StundenZettel(this.entry));
      this.setFilter();
    }
    this.cancel();
  }

  public cancel() {
    this.entry = null;
    this.current = null;
  }

  public create() {
    let data: any = {};
    let letzterEintrag = this.stundenZettelGefiltert.sort((a, b) => a.ende.getTime() < b.ende.getTime() ? 1 : -1)[0];
    if (this.filter.start) {
      data.start = new Date(this.filter.start);
      data.start.setHours(8);
    } else {
      data.start = new Date(letzterEintrag.ende);
    }
    this.entry = new StundenZettel(data);
  }

  public get gesamtDauer() {
    let dauer = 0;
    this.stundenZettelGefiltert.forEach(item => {
      dauer += item.dauer;
    });
    return dauer;
  }

}
