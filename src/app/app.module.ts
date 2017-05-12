import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DateModal } from '../pages/ccexpire/modals/datemodal';
import { CcExpirePage } from '../pages/ccexpire/ccexpire';
import { CustomersPage } from '../pages/customers/customers';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AddCustomerPage } from '../pages/addcustomer/addcustomer';

import { CustomerService } from '../services/customer.service'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '54074253'
  }
};

@NgModule({
  declarations: [
    MyApp,
    CcExpirePage,
    CustomersPage,
    DashboardPage,
    SettingPage,
    TabsPage,
    LoginPage,
    AddCustomerPage,
    DateModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CcExpirePage,
    CustomersPage,
    DashboardPage,
    SettingPage,
    TabsPage,
    LoginPage,
    AddCustomerPage,
    DateModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CustomerService
  ]
})
export class AppModule {}
