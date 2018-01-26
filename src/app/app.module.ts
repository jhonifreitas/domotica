import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { ConsumoPage } from '../pages/consumo/consumo';
import { DispositivoPage } from '../pages/dispositivo/dispositivo';
import { EspacoPage } from '../pages/espaco/espaco';
import { LocalPage } from '../pages/local/local';
import { GrupoPage } from '../pages/grupo/grupo';
import { GrupoPessoaPage } from '../pages/grupo-pessoa/grupo-pessoa';
import { PermissaoDispositivoPage } from '../pages/permissao-dispositivo/permissao-dispositivo';
import { LoginPage } from '../pages/login/login';
import { PessoaPage } from '../pages/pessoa/pessoa';

import { ListDispositivosPage } from '../pages/list-dispositivos/list-dispositivos';
import { ListPessoasPage } from '../pages/list-pessoas/list-pessoas';
import { ListGruposPage } from '../pages/list-grupos/list-grupos';
import { ListEspacosPage } from '../pages/list-espacos/list-espacos';

import { ServiceProvider } from '../providers/service/service';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { MethodsDefaultProvider } from '../providers/methods-default/methods-default';

@NgModule({
  declarations: [
    MyApp,
    ConsumoPage,
    DispositivoPage,
    EspacoPage,
    LocalPage,
    GrupoPage,
    GrupoPessoaPage,
    PermissaoDispositivoPage,
    LoginPage,
    PessoaPage,
    ListDispositivosPage,
    ListPessoasPage,
    ListGruposPage,
    ListEspacosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConsumoPage,
    DispositivoPage,
    EspacoPage,
    LocalPage,
    GrupoPage,
    GrupoPessoaPage,
    PermissaoDispositivoPage,
    LoginPage,
    PessoaPage,
    ListDispositivosPage,
    ListPessoasPage,
    ListGruposPage,
    ListEspacosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceProvider,
    AuthenticationProvider,
    MethodsDefaultProvider
  ]
})
export class AppModule {}
