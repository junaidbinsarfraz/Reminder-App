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
  public searchQuery: string = '';

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public events: Events, public storage: Storage) {
    
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

  ionViewWillEnter() {

    this.storage.get('customers').then((val) => {
      if (val) {
        this.customers = val;
      }
    });

  }

  onCancel(event) {
    // Reset items back to all of the items
    this.storage.get('customers').then((val) => {
      if (val) {
        this.customers = val;
        const copy = { ...this.customers };
      }
    });
  }

  onInput(searchbar) {
    // Reset items back to all of the items
    this.storage.get('customers').then((val) => {
      if (val) {
        this.customers = val;

        // set q to the value of the searchbar
        // var q = searchbar.target.value;
        // if the value is an empty string don't filter the items
        if (!this.searchQuery || this.searchQuery.trim() == '') {
          this.storage.get('customers').then((val) => {
            if (val) {
              this.customers = val;
            }
          });
          return;
        }

        this.customers = this.customers.filter((v) => {

          if (v.policyNo.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || v.policyOwner.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
            || v.dueDate.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1) {
            return true;
          }

          return false;
        })
      }
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
            this.searchQuery = '';
            this.navCtrl.push(AddCustomerPage, {
              isEditing: true,
              customer: selectedCustomer
            });
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.searchQuery = '';
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
