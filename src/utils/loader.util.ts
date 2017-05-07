import { LoadingController } from 'ionic-angular';

export default class LoaderUtil {

    public static loader: any;
    public static loadingCtrl: LoadingController;

    static init(loadingCtrl: LoadingController) { 
        LoaderUtil.loadingCtrl = loadingCtrl;
    }

    static showDefaultLoader() {
        LoaderUtil.loader = LoaderUtil.loadingCtrl.create({
            content: "Processing ..."
        });
        LoaderUtil.loader.present();
    }

    static showLoader(text) {
        LoaderUtil.loader = LoaderUtil.loadingCtrl.create({
            content: text
        });
        LoaderUtil.loader.present();
    }

    static dismissLoader() {
        LoaderUtil.loader.dismissAll();
    }

}