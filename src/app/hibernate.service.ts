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
    return this.http.get(`${environment.api}/${model.controller}/get.php?id=${id}`).map(response => response.json());
  }

}
