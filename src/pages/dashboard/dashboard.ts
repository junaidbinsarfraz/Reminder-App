import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Customer } from '../../models/customer';

@Component({
  selector: 'page-home',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  public customersDueDayOne: Customer[] = [];
  public customersDueDayThree: Customer[] = [];
  public customersDueDaySeven: Customer[] = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public events: Events, public storage: Storage) {

    this.events.subscribe('customerListUpdated', () => {
      this.updateLists();
      console.log("CcExpirePage");
    });

  }

  ionViewWillEnter() {

    this.updateLists();

  }

  updateLists() {
    this.customersDueDayOne = [];
    this.customersDueDayThree = [];
    this.customersDueDaySeven = [];

    this.storage.get('customers').then((val) => {

      this.customersDueDayOne = [];
      this.customersDueDayThree = [];
      this.customersDueDaySeven = [];

      if (val) {

        val.forEach(customer => {

          if (!customer.paid) {

            // Populate each customers' list w.r.t. respective payment due dates
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 
            var dummyDate = new Date(customer.dueDate);
            // dummyDate.setMonth(dummyDate.getMonth() - 1);

            var diffDays = Math.round(Math.abs((dummyDate.getTime() - new Date().getTime()) / (oneDay)));

            if (diffDays == 1) {
              this.customersDueDayOne.push(customer);
            } else if (diffDays == 3) {
              this.customersDueDayThree.push(customer);
            } else if (diffDays == 7) {
              this.customersDueDaySeven.push(customer);
            }

          }

        });
      }

      this.storage.set("dashboardEventCount", this.customersDueDayOne.length + this.customersDueDayThree.length + this.customersDueDaySeven.length).then(() => {

        this.events.publish("updateTabs");
      });

    });
  }

  showConfirm(selectedCustomer: Customer) {
    let confirm = this.alertCtrl.create({
      title: 'Payment',
      message: 'Has customer paid the due payment?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Paid',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
