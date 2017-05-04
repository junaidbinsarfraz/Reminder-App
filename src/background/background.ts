// import { BackgroundMode } from '@ionic-native/background-mode';

// export class Background {

//     constructor(private backgroundMode: BackgroundMode) {

//         // Android customization
//         // To indicate that the app is executing tasks in background and being paused would disrupt the user.
//         // The plug-in has to create a notification while in background - like a download progress bar.
//         this.backgroundMode.setDefaults({
//             title: 'Reminder App',
//             text: 'Executing background tasks.'
//         });

//         // Enable background mode
//         this.backgroundMode.enable();

//         // Called when background mode has been activated
//         // note: onactive now returns an returns an observable that emits when background mode is activated
//         this.backgroundMode.on('activate').subscribe(() => {
//             // The code that you want to run repeatedly

//             // TODO: Check if any of the event occurred

//         });

//     }



// }