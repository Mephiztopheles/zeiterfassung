import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Model} from "./model";
import 'rxjs/add/operator/map'
import {environment} from "../environments/environment";

@Injectable()
export class HibernateService {

  constructor(private http: Http) {
  }

  save(entity: Model) {
    console.log(this.http, entity);
  }

  get(id: number, model: any) {
    return this.http.get(`${environment.api}/${model.controller}/get.php?id=${id}`).map(response => new model(response.json()));
  }

  list(model: any) {
    return this.http.get(`${environment.api}/${model.controller}/list.php`).map(response => {
      let json = response.json();
      let list = [];
      json.forEach(item => list.push(new model(item)));
      return list;
    });
  }

}
