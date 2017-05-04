import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, Events } from 'ionic-angular';

import { Customer } from '../../models/customer';

@Component({
    selector: 'page-addcustomer',
    templateUrl: 'addcustomer.html'
})

export class AddCustomerPage {
    public customer = new Customer();
    public isEditing: boolean = false;
    public dueDate: string = new Date().toISOString();
    public ccExpireDate: string = new Date().toISOString();

    constructor(public navCtrl: NavController, public params: NavParams, public events: Events, public alertCtrl: AlertController) {
        this.isEditing = params.get("isEditing");
        this.customer = params.get("customer");
        if (this.isEditing) {
            this.dueDate = new Date(this.customer.dueDate).toISOString();
            if (this.customer.methodOfPayment == "Debit/ Credit Card") {
                const [month, year] = this.customer.ccExpire.split('/');
                console.log(this.customer.ccExpire);
                console.log([month, year]);
                
                var ccExpireDateLastDay = new Date(Number(year), Number(month), 0);
                console.log(ccExpireDateLastDay);
                this.ccExpireDate = (ccExpireDateLastDay).toISOString();
            }
        }
    }

    doSave() {

        // TODO: Validate
        if ((this.customer.methodOfPayment == "" || this.customer.paymentMode == "" || this.customer.policyNo == ""
            || this.customer.policyOwner == "" || this.customer.premium == "" || this.customer.proposedInsured == "")
            || (this.customer.paymentMode == "Debit/ Credit Card" && this.customer.ccExpire == "")) {

            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'All fields are required.',
                buttons: ['OK']
            });
            alert.present();

            return;
        }

        var selectedDueDate = new Date(this.dueDate);

        this.customer.dueDate = (selectedDueDate.getMonth() + 1) + "/" + selectedDueDate.getDate() + "/" + selectedDueDate.getFullYear();

        var selectedCcExpireDate = new Date(this.ccExpireDate);

        console.log(this.ccExpireDate);
        console.log(selectedCcExpireDate);

        this.customer.ccExpire = (selectedCcExpireDate.getMonth() + 1) + "/" + selectedCcExpireDate.getFullYear();

        if (this.isEditing) {
            this.customer.cardRenewed = false;
            this.customer.paid = false;
        }

        this.events.publish('customerSaved', {
            customer: this.customer,
            isEditing: this.isEditing
        });
        this.navCtrl.pop();

    }

    doCancel() {
        this.navCtrl.pop();
    }

    someEvent(event) {
        console.log(event.target);
    }

}