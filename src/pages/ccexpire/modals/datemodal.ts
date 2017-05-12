import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'datemodal.html'
})
export class DateModal {

    public ccExpireDate: string;

  constructor(private viewCtrl: ViewController) {
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  doSave() {
      console.log(this.ccExpireDate);
  }

}