import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { CustomerService } from '../../services/customer.service';

import { CcExpirePage } from '../ccexpire/ccexpire';
import { CustomersPage } from '../customers/customers';
import { DashboardPage } from '../dashboard/dashboard';
import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = CcExpirePage;
  tab3Root = CustomersPage;
  tab4Root = SettingPage;

  public dashboardEventCount: number = null;
  public ccExpireEventCount: number = null;

  constructor(public events: Events, public customerService: CustomerService) {

    this.events.subscribe('updateTabs', () => {
      // this.storage.get("ccExpireEventCount").then((val) => {
      //   this.ccExpireEventCount = val;

      //   this.storage.get("dashboardEventCount").then((val) => {
      //     this.dashboardEventCount = val;

      //     if (this.dashboardEventCount == 0) {
      //       this.dashboardEventCount = null;
      //     }

      //     if (this.ccExpireEventCount == 0) {
      //       this.ccExpireEventCount = null;
      //     }
      //   });
      // });

      this.updateTabCounts();

    });

  }

  ionViewWillEnter() {
    this.updateTabCounts();
  }

  updateTabCounts() {
    this.customerService.getTabCounts().then((val) => {

      this.ccExpireEventCount = <number>val['ccExpiryCount'];
      this.dashboardEventCount = <number>val['dashboardCount'];

      if (!this.dashboardEventCount || this.dashboardEventCount == 0) {
        this.dashboardEventCount = null;
      }

      if (!this.ccExpireEventCount || this.ccExpireEventCount == 0) {
        this.ccExpireEventCount = null;
      }

    }).catch((error) => {
      console.log("Error" + error);
    });
  }
}
