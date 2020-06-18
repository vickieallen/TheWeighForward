import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  @ViewChild('tabs') tabs: IonTabs;
  activeTab = '';
  constructor() {}
  getSelectedTab(): void {
    this.activeTab = this.tabs.getSelected();
  }
}
