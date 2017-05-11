import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';

import { CustomerService } from '../../services/customer.service';

import ToastUtil from '../../utils/toast.util';
import LoaderUtil from '../../utils/loader.util';

import { Customer } from '../../models/customer';

@Component({
  selector: 'page-home',
  templateUrl: 'setting.html'
})
export class SettingPage {

  private isSubscribed: boolean = false;
  public feedback: string = '';

  constructor(public user: User, public navCtrl: NavController, private customerService: CustomerService) {
    // this.customerService = this.user.data.get('isSubscribed');

    this.isSubscribed = this.customerService.getUserSubscriptionStatus();
  }

  ionViewWillEnter() {

  }

  upgrade() {

    LoaderUtil.showLoader("Please wait ...");

    // TODO: Implement payment gateway (paypal)

    // After successfull payment
    // If payment done then store in local storage and also on cloud. Becuase if cloud fail then it will get the values from local storage
    this.customerService.paymentSuccessfull().then(() => {

      // Upgrade to cloud
      this.customerService.getCustomers().then((val) => {
        var customers = <Array<Customer>>val;

        this.customerService.saveCustomers(customers, true).then(() => {

          this.isSubscribed = true;
          this.customerService.addKeyValueToStorage('isSubscribed', true, 'cloud').then(() => {
            this.customerService.updateSubscriptionStatus();
            LoaderUtil.dismissLoader();
            ToastUtil.showToast("Successfully Upgraded");
          }).catch((error) => {
            this.customerService.addKeyValueToStorage('upgradeStatusCode', 400, 'local');
            LoaderUtil.dismissLoader();
            ToastUtil.showToast("Successfully Upgraded");
          });

        }).catch((error) => {

          // TODO: uploadStatus 401
          this.customerService.addKeyValueToStorage('upgradeStatusCode', 401, 'local');

          LoaderUtil.dismissLoader();
          ToastUtil.showToast("Unable to move data to cloud. You may contact to out customer services.", 5000);

        });

      }).catch((error) => {

        // TODO: uploadStatus 402
        this.customerService.addKeyValueToStorage('upgradeStatusCode', 402, 'local');

        LoaderUtil.dismissLoader();
        ToastUtil.showToast("Unable to move data to cloud. You may contact to out customer services.", 5000);

      });

    }).catch((error) => {

      // TODO: uploadStatus 403
      this.customerService.addKeyValueToStorage('upgradeStatusCode', 403, 'local');

      LoaderUtil.dismissLoader();
      ToastUtil.showToast(error, 5000);

    });

    this.user.set('', '');
  }

  sendFeedback() {
    if (!this.feedback) {
      ToastUtil.showToast("Please fill feedback form.");
      return;
    }

    // TODO: Email sending 
  }

}
