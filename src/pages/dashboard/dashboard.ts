import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, Events } from 'ionic-angular';

import { CustomerService } from '../../services/customer.service';

import { Customer } from '../../models/customer';

import ToastUtil from '../../utils/toast.util';
import LoaderUtil from '../../utils/loader.util';

@Component({
  selector: 'page-home',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  public customersDueDayOne: Customer[] = [];
  public customersDueDayThree: Customer[] = [];
  public customersDueDaySeven: Customer[] = [];
  private isSubscribed: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public events: Events, public customerService: CustomerService) {

    this.events.subscribe('customerListUpdated', () => {
      this.updateLists();
      console.log("CcExpirePage");
    });

    this.isSubscribed = this.customerService.getUserSubscriptionStatus();

  }

  ionViewWillEnter() {

    this.isSubscribed = this.customerService.getUserSubscriptionStatus();

    this.updateLists();

  }

  updateLists() {
    // this.customersDueDayOne = [];
    // this.customersDueDayThree = [];
    // this.customersDueDaySeven = [];

    // this.storage.get('customers').then((val) => {

    //   this.customersDueDayOne = [];
    //   this.customersDueDayThree = [];
    //   this.customersDueDaySeven = [];

    //   if (val) {

    //     val.forEach(customer => {

    //       if (!customer.paid) {

    //         // Populate each customers' list w.r.t. respective payment due dates
    //         var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 
    //         var dummyDate = new Date(customer.dueDate);
    //         // dummyDate.setMonth(dummyDate.getMonth() - 1);

    //         var diffDays = Math.round((dummyDate.getTime() - new Date().getTime()) / (oneDay));

    //         if (diffDays == 1) {
    //           this.customersDueDayOne.push(customer);
    //         } else if (diffDays == 3) {
    //           this.customersDueDayThree.push(customer);
    //         } else if (diffDays == 7) {
    //           this.customersDueDaySeven.push(customer);
    //         }

    //       }

    //     });
    //   }

    //   this.storage.set("dashboardEventCount", this.customersDueDayOne.length + this.customersDueDayThree.length + this.customersDueDaySeven.length).then(() => {

    //     this.events.publish("updateTabs");
    //   });

    // });

    return new Promise((resolve, reject) => {

      this.customerService.getDueDateLists().then((val: {}) => {
        this.customersDueDayOne = <Array<Customer>>(val['day1']);
        this.customersDueDayThree = <Array<Customer>>(val['day3']);
        this.customersDueDaySeven = <Array<Customer>>(val['day7']);

        this.events.publish("updateTabs");

        resolve();
      }).catch((error) => {
        this.events.publish("updateTabs");

        reject(error);
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

            if (this.isSubscribed) {
              LoaderUtil.showLoader("Please wait ...");
            }

            this.customerService.getCustomers().then((val) => {
              var customers = <Array<Customer>>val;

              try {

                let index: number = customers.indexOf(selectedCustomer);
                if (index !== -1) {
                  // Set values
                  var date = new Date(selectedCustomer.dueDate);
                  if (selectedCustomer.paymentMode == 'Monthly') {
                    date.setMonth(date.getMonth() + 1);
                  } else if (selectedCustomer.paymentMode == 'Quarterly') {
                    date.setMonth(date.getMonth() + 3);
                  } else if (selectedCustomer.paymentMode == 'Semi-Annually') {
                    date.setMonth(date.getMonth() + 6);
                  } else if (selectedCustomer.paymentMode == 'Annually') {
                    date.setMonth(date.getMonth() + 12);
                  }

                  selectedCustomer.dueDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

                  customers[index] = selectedCustomer;

                  this.customerService.saveCustomers(customers).then(() => {
                    this.updateLists().then(() => {
                      if (this.isSubscribed) {
                        LoaderUtil.dismissLoader();
                      }

                      ToastUtil.showToast("Successfully saved");

                    }).catch((error) => {
                      // TODO: show error, Saved successfully, not able to load list
                      if (this.isSubscribed) {
                        LoaderUtil.dismissLoader();
                      }

                      ToastUtil.showToast("Unable to process request");

                    });
                  }).catch((error) => {
                    if (this.isSubscribed) {
                      LoaderUtil.dismissLoader();
                    }

                    ToastUtil.showToast("Unable to process request");

                    return false;
                  });
                }

              } catch (exception) {
                if (this.isSubscribed) {
                  LoaderUtil.dismissLoader();
                }

                ToastUtil.showToast("Unable to process request");

                return false;
              }

            }).catch((error) => {
              if (this.isSubscribed) {
                LoaderUtil.dismissLoader();
              }

              ToastUtil.showToast("Unable to process request");

              return false;
            });

          }
        }
      ]
    });
    confirm.present();
  }

}
