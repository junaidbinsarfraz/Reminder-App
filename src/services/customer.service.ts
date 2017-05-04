/* Notice that the imports have slightly changed*/
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/Rx';

import { Storage } from '@ionic/storage';

@Injectable()
export class CustomerService {

    public data;
    public http;

  constructor(http: Http, private storage: Storage) {
    this.http = http;
    this.data = null;
  }

  getCustomers() {

  }
}