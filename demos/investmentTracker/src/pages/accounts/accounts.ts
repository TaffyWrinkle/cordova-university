import { Component, ViewChild, NgZone } from '@angular/core';

import { AlertController, App, Events, List, ModalController, NavController } from 'ionic-angular';
import { AccountData } from '../../providers/account-data';
import { AddAccountModal} from '../add-account-modal/add-account';
import { AccountDetailPage } from '../account-detail/account-detail';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  // the list is a child of the schedule page
  // @ViewChild('accountList') gets a reference to the list
  // with the variable #accountList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('accountList', { read: List }) accountList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownSessions: any = [];
  accounts = [];

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public accountData: AccountData,
    public user: UserData,
    public events: Events,
    public zone: NgZone
  ) {
    this.events.subscribe('user:login', this.updateAccounts.bind(this));
  }

  ionViewDidEnter() {
    this.app.setTitle('Accounts');
  }

  ngAfterViewInit() {
    //this.updateAccounts();
  }

  doRefresh(refresher) {
    this.updateAccounts().then(refresher.complete.bind(refresher));
  }

  updateAccounts() {
    // Close any open sliding items when the schedule updates
    this.accountList && this.accountList.closeSlidingItems();
    return this.accountData.getAccounts().then(accounts => {
      this.zone.run(() => {
        this.accounts = accounts
      })
    });
  }

  addAccount() {
    let modal = this.modalCtrl.create(AddAccountModal);
    modal.present();

    // TODO: Handle dismissal of modal
  }

  goToAccountDetail(accountData) {
    this.navCtrl.push(AccountDetailPage, accountData);
  }

}
