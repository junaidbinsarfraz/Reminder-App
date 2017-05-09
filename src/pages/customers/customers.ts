import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActionSheetController, Events } from 'ionic-angular';

import { CustomerService } from '../../services/customer.service';

import { AddCustomerPage } from '../addcustomer/addcustomer';

import { Customer } from '../../models/customer';

import ToastUtil from '../../utils/toast.util';

@Component({
  selector: 'page-contact',
  templateUrl: 'customers.html'
})
export class CustomersPage {

  public customers: Customer[] = [];
  public searchQuery: string = '';

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public events: Events, private customerService: CustomerService) {

    this.events.subscribe('customerSaved', (data) => {
      // Extract customer
      try {
        if (!data.isEditing) {
          this.customers.push(data.customer);
        } else {
          let index: number = this.customers.indexOf(data.customer);
          // console.log(index);
          if (index !== -1) {
            this.customers[index] = data.customer;
          }
        }

        customerService.saveCustomers(this.customers).then((val) => {
          this.customers = <Array<Customer>>val;
          this.events.publish('customerListUpdated');
          this.events.publish("updateTabs");
          ToastUtil.showToast("Successfully saved");
        }).catch((error) => {
          this.customerService.getCustomers().then((val) => {
            this.customers = <Array<Customer>>val;
          });
          ToastUtil.showToast("Unable to save");
        });
      } catch (e) {
        ToastUtil.showToast("Unable to save");
      }

    });

  }

  ionViewWillEnter() {

    this.customerService.getCustomers().then((val) => {
      if (val) {
        this.customers = <Array<Customer>>val;
      }
    });

  }

  onCancel(event) {
    // Reset items back to all of the items
    this.customerService.getCustomers().then((val) => {
      if (val) {
        this.customers = <Array<Customer>>val;
      }
    });
  }

  onInput(searchbar) {
    // Reset items back to all of the items
    this.customerService.getCustomers().then((val) => {
      if (val) {
        this.customers = <Array<Customer>>val;

        // set q to the value of the searchbar
        // var q = searchbar.target.value;
        // if the value is an empty string don't filter the items
        if (!this.searchQuery || this.searchQuery.trim() == '') {
          this.customerService.getCustomers().then((val) => {
            if (val) {
              this.customers = <Array<Customer>>val;
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

            // this.customerService.deleteCustomer(selectedCustomer).then((val) => {
            //   this.customers = <Array<Customer>>val;
            //   this.events.publish('customerListUpdated');
            //   this.events.publish("updateTabs");
            //   // TODO: Show message
            // }).catch((error) => {
            //   console.log(error);
            //   // TODO: Show message
            // });

            let index: number = this.customers.indexOf(selectedCustomer);
            if (index !== -1) {
              this.customers.splice(index, 1);
              this.customerService.saveCustomers(this.customers).then((val) => {
                this.customers = <Array<Customer>>val;
                this.events.publish('customerListUpdated');
                this.events.publish("updateTabs");
                ToastUtil.showToast("Successfully deleted");
              }).catch((error) => {
                this.customerService.getCustomers().then((val) => {
                  this.customers = <Array<Customer>>val;
                });
                console.log(error);
                ToastUtil.showToast("Unable to delete");
              });
            } else {
              ToastUtil.showToast("Unable to delete");
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
