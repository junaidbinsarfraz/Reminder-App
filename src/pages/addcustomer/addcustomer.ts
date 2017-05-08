import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { Customer } from '../../models/customer';

import LoaderUtil from '../../utils/loader.util';

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
    }

    ionViewWillEnter() {
        this.isEditing = this.params.get("isEditing");
        this.customer = this.params.get("customer");
        if (this.isEditing) {

            const [dueDateMonth, dueDateDay, dueDateYear] = this.customer.dueDate.split('/');
            this.dueDate = new Date(Number(dueDateYear), Number(dueDateMonth) - 1, Number(dueDateDay) + 1).toISOString();

            if (this.customer.methodOfPayment == "Debit/ Credit Card") {

                const [month, year] = this.customer.ccExpire.split('/');

                var ccExpireDateLastDay = new Date(Number(year), Number(month), 0);

                this.ccExpireDate = (ccExpireDateLastDay).toISOString();
            }
        }
    }

    doSave() {
        // LoaderUtil.showDefaultLoader();
        // TODO: Validate
        if ((this.customer.methodOfPayment == "" || this.customer.paymentMode == "" || this.customer.policyNo == ""
            || this.customer.policyOwner == "" || this.customer.premium == "" || this.customer.proposedInsured == "")
            || (this.customer.paymentMode == "Debit/ Credit Card" && this.customer.ccExpire == "")) {

            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'All fields are required.',
                buttons: ['OK']
            });
            // LoaderUtil.dismissLoader();
            alert.present();

            return;
        }

        var selectedDueDate;

        if (Object.prototype.toString.call(this.dueDate).includes("String")) {
            selectedDueDate = new Date(this.dueDate);
            this.customer.dueDate = (selectedDueDate.getMonth() + 1) + "/" + (this.isEditing ? selectedDueDate.getDate() - 1 : selectedDueDate.getDate())
                + "/" + selectedDueDate.getFullYear();
        } else {
            // It is Object json
            selectedDueDate = this.dueDate;
            this.customer.dueDate = selectedDueDate.month + '/' + selectedDueDate.day + '/' + selectedDueDate.year;
        }

        var selectedCcExpireDate;

        if (Object.prototype.toString.call(this.ccExpireDate).includes("String")) {
            selectedCcExpireDate = new Date(this.ccExpireDate);
            this.customer.ccExpire = (selectedCcExpireDate.getMonth() + 1) + "/" + selectedCcExpireDate.getFullYear();
        } else {
            // It is Object json
            selectedCcExpireDate = this.ccExpireDate;
            this.customer.ccExpire = selectedCcExpireDate.month + '/' + selectedCcExpireDate.year;
        }

        if (this.isEditing) {
            this.customer.cardRenewed = false;
            this.customer.paid = false;
        }

        // LoaderUtil.dismissLoader();

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