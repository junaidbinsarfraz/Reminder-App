import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActionSheetController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AddCustomerPage } from '../addcustomer/addcustomer';

import { Customer } from '../../models/customer';

@Component({
  selector: 'page-contact',
  templateUrl: 'customers.html'
})
export class CustomersPage {

  public customers: Customer[] = [];

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public events: Events, public storage: Storage) {
    // this.customers = [
    //   new Customer("PolicyNumber", "Owner", "insured", "Monthly", "11/11/2017", "Direct Pay", "premium"),
    //   new Customer("PolicyNumber", "Owner", "insured", "Monthly", "01/01/2017", "Direct Pay", "premium"),
    //   new Customer("PolicyNumber", "Owner", "insured", "Monthly", "01/02/2017", "Direct Pay", "premium")
    // ];

    storage.get('customers').then((val) => {
      if (val) {
        this.customers = val;
      }
    })

    this.events.subscribe('customerSaved', (data) => {
      // Extract customer
      if (!data.isEditing) {
        this.customers.push(data.customer);
      } else {
        let index: number = this.customers.indexOf(data.customer);
        // console.log(index);
        if (index !== -1) {
          this.customers[index] = data.customer;
        }
      }

      this.storage.set('customers', this.customers).then(() => {
        this.events.publish('customerListUpdated');
      });
    });
  }

  presentActionSheet(selectedCustomer: Customer) {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Action',
      buttons: [
        {
          text: 'Edit',
          role: 'navigation',
          handler: () => {
            this.navCtrl.push(AddCustomerPage, {
              isEditing: true,
              customer: selectedCustomer
            });
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            let index: number = this.customers.indexOf(selectedCustomer);
            if (index !== -1) {
              this.customers.splice(index, 1);
              this.storage.set('customers', this.customers);
              this.events.publish('customerListUpdated');
            }
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showCustomer() {
    this.navCtrl.push(AddCustomerPage, {
      isEditing: false,
      customer: new Customer()
    });
  }

}
