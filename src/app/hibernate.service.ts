import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Model} from "./model";
import 'rxjs/add/operator/map'

@Injectable()
export class HibernateService {

  constructor(private http: Http) {
  }

  save(entity: Model) {
    console.log(this.http, entity);
  }

  get(id: number, model: any) {
    return this.http.get(`http://localhost/zeiterfassung/${model.controller}/get/${id}.json`).map(response => response.json());
  }

}
