import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  public dashboardEventCount: number = 0;
  public ccExpireEventCount: number = 0;

  constructor(public events: Events, public storage: Storage) {

    if (this.dashboardEventCount == 0) {
      this.dashboardEventCount = null;
    }

    if (this.ccExpireEventCount == 0) {
      this.ccExpireEventCount = null;
    }

    this.events.subscribe('updateTabs', () => {
      this.storage.get("ccExpireEventCount").then((val) => {
        this.ccExpireEventCount = val;

        this.storage.get("dashboardEventCount").then((val) => {
          this.dashboardEventCount = val;

          if (this.dashboardEventCount == 0) {
            this.dashboardEventCount = null;
          }

          if (this.ccExpireEventCount == 0) {
            this.ccExpireEventCount = null;
          }
        });
      });

    });

  }
}
