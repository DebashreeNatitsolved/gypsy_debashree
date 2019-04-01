import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { AuthProvider } from '../providers/auth/auth';
import { ApiProvider } from '../providers/api/api';
import { ServiceProvider } from '../providers/service/service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
// import { HomePage } from '../pages/home/home';


@NgModule({
  declarations: [
    MyApp,
    // HomePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    
    StatusBar,
    SplashScreen,
    AuthProvider,
    ApiProvider,
    ServiceProvider,
    InAppBrowser,
    Camera,
    FileTransfer,
    FilePath,
    File,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    TwitterConnect,
    YoutubeVideoPlayer,   
  ]
})
export class AppModule {}
