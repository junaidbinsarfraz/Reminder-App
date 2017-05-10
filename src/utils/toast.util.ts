import { ToastController } from 'ionic-angular';

export default class ToasterUtil {

    private static toast: any;
    private static toastCtrl: ToastController;

    static init(toastCtrl: ToastController) {
        ToasterUtil.toastCtrl = toastCtrl;
    }

    // static showDefaultLoader() {
    //     LoaderUtil.loader = LoaderUtil.loadingCtrl.create({
    //         content: "Processing ..."
    //     });
    //     LoaderUtil.loader.present();
    // }

    // static showLoader(text) {
    //     LoaderUtil.loader = LoaderUtil.loadingCtrl.create({
    //         content: text
    //     });
    //     LoaderUtil.loader.present();
    // }

    // static dismissLoader() {
    //     LoaderUtil.loader.dismissAll();
    // }

    static showDefaultToast() {
        ToasterUtil.toast = this.toastCtrl.create({
            message: `Operation Completed`,
            duration: 2000
        });
        ToasterUtil.toast.present();
    }

    static showToast(message, duration?) {
        ToasterUtil.toast = this.toastCtrl.create({
            message: message,
            duration: duration ? duration : 2000,
            position: 'top'
        });
        ToasterUtil.toast.present();
    }

}