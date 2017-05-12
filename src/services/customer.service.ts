/* Notice that the imports have slightly changed*/
import { Injectable } from "@angular/core";

import { User } from '@ionic/cloud-angular';
import { Storage } from '@ionic/storage';

import { Customer } from '../models/customer';

@Injectable()
export class CustomerService {

  // public data;
  // public http;

  private customers: Customer[] = [];
  private customersDueDayOne: Customer[] = [];
  private customersDueDayThree: Customer[] = [];
  private customersDueDaySeven: Customer[] = [];
  private customersCcExpired: Customer[] = [];

  private dashboardCount: number = 0;
  private ccExpiryCount: number = 0;
  private isSubscribed: boolean = false;

  constructor(private storage: Storage, public user: User) {
    // this.http = http;
    // this.data = null;
    this.isSubscribed = this.user.data.get('isSubscribed');
  }

  getCustomers() {
    return new Promise((resolve, reject) => {

      if (this.customers.length > 0) {
        resolve(this.customers);
        return;
      }

      if (this.isSubscribed) {
        this.customers = this.user.data.get('customers');
      } else {
        this.storage.get('customers').then((val) => {
          if (val) {
            this.customers = val;
            // this.updateDueDateAndExpiryLists();
            resolve(val);
          }
        }).catch((error) => {
          console.log("ERROR" + error)
          reject(error);
        });
      }
    });
  }

  saveCustomers(updatedCustomers: Customer[], isSubscribed?: boolean) {
    return new Promise((resolve, reject) => {

      if (isSubscribed || this.isSubscribed) {
        this.user.set("customers", updatedCustomers);
        this.user.save().then(() => {
          this.customers = updatedCustomers;
          this.updateDueDateAndExpiryLists();
          resolve(this.customers);
        }).catch((error) => {
          reject(error);
        });
      } else {
        this.storage.set('customers', updatedCustomers).then(() => {
          this.customers = updatedCustomers;
          this.updateDueDateAndExpiryLists();
          resolve(this.customers);
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

  // deleteCustomer(customer: Customer) {
  //   return new Promise((resolve, reject) => {
  //     let index: number = this.customers.indexOf(customer);
  //     if (index !== -1) {
  //       this.customers.splice(index, 1);
  //       this.storage.set('customers', this.customers).then(() => {
  //         this.updateDueDateAndExpiryLists();
  //         resolve(this.customers);
  //       }).catch((error) => {
  //         reject(error);
  //       });
  //     } else {
  //       reject('Unable to find customer in the list');
  //     }
  //   });
  // }

  updateDueDateAndExpiryLists() {

    return new Promise((resolve, reject) => {

      this.customersDueDayOne = [];
      this.customersDueDayThree = [];
      this.customersDueDaySeven = [];
      this.customersCcExpired = [];

      if (this.customers.length > 0) {
        this.customers.forEach(customer => {

          if (!customer.paid) {

            // Populate each customers' list w.r.t. respective payment due dates
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 
            var dummyDate = new Date(customer.dueDate);
            // dummyDate.setMonth(dummyDate.getMonth() - 1);

            var diffDays = Math.round((new Date().getTime() - dummyDate.getTime()) / (oneDay));

            if (diffDays == 1) {
              this.customersDueDayOne.push(customer);
            } else if (diffDays == 3) {
              this.customersDueDayThree.push(customer);
            } else if (diffDays == 7) {
              this.customersDueDaySeven.push(customer);
            }

          }

          if (customer.methodOfPayment == "Debit/ Credit Card" && !customer.cardRenewed) {

            // Populate each customers' list w.r.t. respective payment due dates
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 

            const [month, year] = customer.ccExpire.split('/');

            // var dummyDate = new Date("1/" + customer.ccExpire);
            var ccExpireDateLastDay = new Date(Number(year), Number(month), 0);

            var diffDays = Math.round((ccExpireDateLastDay.getTime() - new Date().getTime()) / (oneDay));

            if (diffDays < 30 && diffDays > -1) {
              this.customersCcExpired.push(customer);
            }
          }

        });

        resolve();
        return;
      }

      this.getCustomers().then((val) => {

        this.customersDueDayOne = [];
        this.customersDueDayThree = [];
        this.customersDueDaySeven = [];
        this.customersCcExpired = [];

        if (this.customers) {

          this.customers.forEach(customer => {

            if (!customer.paid) {

              // Populate each customers' list w.r.t. respective payment due dates
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 
              var dummyDate = new Date(customer.dueDate);
              // dummyDate.setMonth(dummyDate.getMonth() - 1);

              var diffDays = Math.round((new Date().getTime() - dummyDate.getTime()) / (oneDay));

              if (diffDays == 1) {
                this.customersDueDayOne.push(customer);
              } else if (diffDays == 3) {
                this.customersDueDayThree.push(customer);
              } else if (diffDays == 7) {
                this.customersDueDaySeven.push(customer);
              }

            }

            if (customer.methodOfPayment == "Debit/ Credit Card" && !customer.cardRenewed) {

              // Populate each customers' list w.r.t. respective payment due dates
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds 

              const [month, year] = customer.ccExpire.split('/');

              // var dummyDate = new Date("1/" + customer.ccExpire);
              var ccExpireDateLastDay = new Date(Number(year), Number(month), 0);

              var diffDays = Math.round((ccExpireDateLastDay.getTime() - new Date().getTime()) / (oneDay));

              if (diffDays < 30 && diffDays > -1) {
                this.customersCcExpired.push(customer);
              }
            }

          });
        }

        resolve();

      });

    });
  }

  getTabCounts() {

    return new Promise((resolve, reject) => {

      this.updateDueDateAndExpiryLists().then(() => {

        this.dashboardCount = this.customersDueDayOne.length + this.customersDueDayThree.length + this.customersDueDaySeven.length;
        this.ccExpiryCount = this.customersCcExpired.length;
        resolve({ 'dashboardCount': this.dashboardCount, 'ccExpiryCount': this.ccExpiryCount });

      }).catch((error) => {
        console.log("Error" + error);
        reject(error);
      });

    });
  }

  getCcExpiryList() {

    return new Promise((resolve, reject) => {

      this.updateDueDateAndExpiryLists().then(() => {
        resolve(this.customersCcExpired);
      });

    });

  }

  getDueDateLists() {

    return new Promise((resolve, reject) => {

      this.updateDueDateAndExpiryLists().then(() => {
        resolve({ 'day1': this.customersDueDayOne, 'day3': this.customersDueDayThree, 'day7': this.customersDueDaySeven });
      });

    });

  }

  getUserSubscriptionStatus() {
    return this.isSubscribed;
  }

  updateSubscriptionStatus() {
    this.isSubscribed = this.user.data.get('isSubscribed');
  }

  paymentSuccessfull(PaypalInfo?: any) {
    // Do paypal here and move this method to payment service
    return new Promise((resolve, reject) => {

      resolve();

      // this.user.set('paymentCompleted', true);
      // this.user.set('isSubscribed', true);
      // this.user.save().then(() => {
      //   this.isSubscribed = true;
      //   resolve({ status: 200, statusMessage: "Successfully saved" });
      // }).catch((error) => {
      //   console.log('');
      //   // TODO: Generate an email about it to admin
      //   this.storage.set('paymentCompleted', true).then(() => {
      //     reject({ status: 401, statusMessage: "Payment stored in local storage", errorMessage: error });
      //   }).catch((localError) => {
      //     // TODO: Generate an email about it to admin
      //     reject({ status: 404, statusMessage: "Payment not stored in local storage", errorMessage: error, localErrorMessage: localError });
      //   });
      // });
    });
  }

  addKeyValueToStorage(key: string, value: any, storageKind?: string) {
    return new Promise((resolve, reject) => {

      if ((storageKind && storageKind == 'cloud') || (!storageKind && this.isSubscribed)) {
        this.user.set(key, value);
        this.user.save().then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        this.storage.set(key, value).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

  removeKeyValueFromStorage(key: string, storageKind?: string) {
    return new Promise((resolve, reject) => {

      if ((storageKind && storageKind == 'cloud') || (!storageKind && this.isSubscribed)) {
        this.user.unset(key);
        this.user.save().then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        this.storage.remove(key).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

  getValueOfKeyFromStorage(key: string, storageKind?: string) {
    return new Promise((resolve, reject) => {

      if ((storageKind && storageKind == 'cloud') || (!storageKind && this.isSubscribed)) {
        resolve(this.user.get(key, null));
      } else {
        this.storage.get(key).then((value) => {
          resolve(value);
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

}