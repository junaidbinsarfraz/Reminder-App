import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, LoadingController } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

import { CcExpirePage } from '../pages/ccexpire/ccexpire';
import { CustomersPage } from '../pages/customers/customers';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AddCustomerPage } from '../pages/addcustomer/addcustomer';

import LoaderUtil from '../utils/loader.util';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController, public auth: Auth,
    public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Initialize util classes
      LoaderUtil.init(this.loadingCtrl);

      // TODO: Initialize tab values onload

      this.rootPage = CcExpirePage;

      if (this.auth.isAuthenticated()) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
