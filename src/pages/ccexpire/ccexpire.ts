import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AlertController, Events } from 'ionic-angular';

import { CustomerService } from '../../services/customer.service';

import { Customer } from '../../models/customer';

import { DateModal } from '../ccexpire/modals/datemodal'

@Component({
  selector: 'page-about',
  templateUrl: 'ccexpire.html'
})

export class CcExpirePage {

  public customersCcExpired: Customer[] = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public events: Events, public customerService: CustomerService, public modalCtrl: ModalController) {

    this.events.subscribe('customerListUpdated', () => {
      this.updateLists();
      console.log("CcExpirePage");
    });

  }

  ionViewWillEnter() {

    this.updateLists();

  }

  updateLists() {
    // this.storage.get('customers').then((val) => {

    //   this.customersCcExpired = [];

    //   if (val) {

    //     val.forEach(customer => {

    //       if (customer.methodOfPayment == "Debit/ Credit Card" && !customer.cardRenewed) {

    //         // Populate each customers' list w.r.t. respective payment due dates
    //         var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 

    //         const [month, year] = customer.ccExpire.split('/');

    //         // var dummyDate = new Date("1/" + customer.ccExpire);
    //         var ccExpireDateLastDay = new Date(year, month, 0);

    //         var diffDays = Math.round((ccExpireDateLastDay.getTime() - new Date().getTime()) / (oneDay));

    //         if (diffDays < 30 && diffDays > -1) {
    //           this.customersCcExpired.push(customer);
    //         }
    //       }
    //     });
    //   }

    //   this.storage.set("ccExpireEventCount", this.customersCcExpired.length).then(() => {

    //     this.events.publish("updateTabs");
    //   });

    // });

    this.customerService.getCcExpiryList().then((val) => {
      this.customersCcExpired = <Array<Customer>>val;
    });

    this.events.publish("updateTabs");
  }

  showConfirm(selectedCustomer: Customer) {
    let confirm = this.alertCtrl.create({
      title: 'Renew',
      message: 'Has customer renewed the credit card?',
      inputs: [
        {
          name: 'date',
          placeholder: 'CC Expire Date',
          type: 'ion-datetime'
        }
      ],
      buttons: [
        {
          text: 'No',
          handler: (data) => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Renewed',
          handler: (data) => {
            console.log('Agree clicked');
            console.log(data);
            let contactModal = this.modalCtrl.create(DateModal);
             contactModal.present();
          }
        }
      ]
    });
    confirm.present();
  }
}
