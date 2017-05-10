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
      this.isSubscribed = true;
      // Upgrade to cloud

      this.customerService.getCustomers().then((val) => {
        var customers = <Array<Customer>>val;

        this.customerService.saveCustomers(customers).then(() => {

          LoaderUtil.dismissLoader();
          ToastUtil.showToast("Successfully Upgraded");

        }).catch((error) => {

          LoaderUtil.dismissLoader();
          ToastUtil.showToast("Unable to move data to cloud. You may contact to out suctomer services.", 5000);

        });

      }).catch((error) => {

        LoaderUtil.dismissLoader();
        ToastUtil.showToast("Unable to move data to cloud. You may contact to out suctomer services.", 5000);

      });

    }).catch((error) => {

      LoaderUtil.dismissLoader();
      ToastUtil.showToast("Unable to move data to cloud. You may contact to out suctomer services.", 5000);

    });

    this.user.set('', '');
  }

  sendFeedback() {
    if(!this.feedback) {
      ToastUtil.showToast("Please fill feedback form.");
      return;
    }

    // TODO: Email sending 
  }

}
