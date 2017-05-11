import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

import { CustomerService } from '../services/customer.service';

import { CcExpirePage } from '../pages/ccexpire/ccexpire';
import { CustomersPage } from '../pages/customers/customers';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AddCustomerPage } from '../pages/addcustomer/addcustomer';

import LoaderUtil from '../utils/loader.util';
import ToastUtil from '../utils/toast.util';

import { Customer } from '../models/customer';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController, public auth: Auth,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public user: User, private customerService: CustomerService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Initialize util classes
      LoaderUtil.init(this.loadingCtrl);
      ToastUtil.init(this.toastCtrl);

      if (this.auth.isAuthenticated()) {
        this.rootPage = TabsPage;

        // TODO: check if user's data has been moved to cloud successfully if user is subscribed
        this.customerService.getValueOfKeyFromStorage('upgradeStatusCode', 'local').then((val) => {
          try {
            if (val) {
              // Need to be worried
              this.moveDataToCloud(val);

            }
          } catch (exception) {

          }
        }).catch((error) => {
          // everything is cool
        });


      } else {
        this.rootPage = LoginPage;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  moveDataToCloud(value) {

    if (value == 400) {
      this.customerService.addKeyValueToStorage('isSubscribed', true, 'cloud').then(() => {
        this.customerService.updateSubscriptionStatus();
      }).catch((error) => {
        this.customerService.addKeyValueToStorage('upgradeStatusCode', 400, 'local');
      });
    }

    // 401 or 402
    if (value == 401 || value == 402) {
      // Upgrade to cloud
      this.customerService.getCustomers().then((val) => {
        var customers = <Array<Customer>>val;

        this.customerService.saveCustomers(customers, true).then(() => {

          this.customerService.addKeyValueToStorage('isSubscribed', true, 'cloud').then(() => {
            this.customerService.updateSubscriptionStatus();
          }).catch((error) => {
            this.customerService.addKeyValueToStorage('upgradeStatusCode', 400, 'local');
          });

        }).catch((error) => {

          // TODO: uploadStatus 401
          this.customerService.addKeyValueToStorage('upgradeStatusCode', 401, 'local');

        });

      }).catch((error) => {

        // TODO: uploadStatus 402
        this.customerService.addKeyValueToStorage('upgradeStatusCode', 402, 'local');

      });
    }

    // 403, means payment not valid
  }
}
