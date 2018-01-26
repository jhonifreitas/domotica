import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MethodsDefaultProvider } from '../providers/methods-default/methods-default';
import { ServiceProvider } from '../providers/service/service';

import { ConsumoPage } from '../pages/consumo/consumo';
import { EspacoPage } from '../pages/espaco/espaco';
import { LoginPage } from '../pages/login/login';
import { LocalPage } from '../pages/local/local';

// import { ListDispositivosPage } from '../pages/list-dispositivos/list-dispositivos';
import { ListPessoasPage } from '../pages/list-pessoas/list-pessoas';
import { ListGruposPage } from '../pages/list-grupos/list-grupos';
import { ListEspacosPage } from '../pages/list-espacos/list-espacos';

@Component({
    templateUrl: 'app.html',
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage:any = EspacoPage;

    admin:number = 0;
    consumo:number = 0;
    dispositivo:number = 0;
    grupo:number = 0;
    pessoa:number = 0;
    espaco:number = 0;
    redirect: any;

    pages: Array<{ title: string, icon: string, component: any, permissao: string}>;

    constructor(public platform: Platform, 
                public statusBar: StatusBar, 
                public splashScreen: SplashScreen,
                public methods: MethodsDefaultProvider, 
                public service: ServiceProvider, 
                public events: Events) {

        var id = localStorage.getItem('id');
        var local = localStorage.getItem('id_local');
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        this.admin = parseInt(localStorage.getItem('admin'));
        
        // INICIALIZA A PAGINA
        if (local && id && username && password) {
            if (this.admin != 1) {
                this.inicializa();
                this.methods.getPermission();
            }
            else {
                this.rootPage = ListEspacosPage;
            }
            this.getName();
        }
        else {
            this.rootPage = LoginPage;
        }
        this.initializeApp();
        this.pages = [
            { title: 'Consumo', icon: 'md-podium', component: ConsumoPage, permissao: 'consumo' },
            // { title: 'Dispositivos', icon: 'md-laptop', component: DispositivoListPage, permissao: 'dispositivo' },
            { title: 'Grupos', icon: 'md-people', component: ListGruposPage, permissao: 'grupo' },
            { title: 'Pessoas', icon: 'md-person-add', component: ListPessoasPage, permissao: 'pessoa' },
            { title: 'Local', icon: 'md-home', component: LocalPage, permissao: 'local' },
            { title: 'Espaços', icon: 'md-cube', component: ListEspacosPage, permissao: 'espaco' }
        ];
        this.events.subscribe('login', function () {
            this.admin = parseInt(localStorage.getItem('admin'));
            if (this.admin == 1) {
                this.openPage(ListEspacosPage);
            }
            else {
                this.inicializa();
                this.methods.getPermission();
            }
            this.getName();
        });
    }    

    initializeApp() {
        this.platform.ready().then(() =>  {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // this.diagnostic.isWifiEnabled()
            // .then((data) => {
            //   if(!data){
            //     this.diagnostic.switchToWifiSettings();
            //   }
            // });
        });
    }
    openPage(page) {
        this.nav.setRoot(page);
    }
    logout() {
        this.methods.loading("Saindo...");
        // Limpar
        localStorage.setItem('id', '');
        localStorage.setItem('admin', '');
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        this.openPage(LoginPage);
        this.methods.loader.dismiss();
    }
    verificaPermissao(menu) {
        if ((menu == 'consumo' && this.consumo > 0) || this.admin == 1) {
            return true;
        }
        else if ((menu == 'dispositivo' && this.dispositivo > 0) || this.admin == 1) {
            return true;
        }
        else if ((menu == 'espaco' && this.espaco > 0) || this.admin == 1) {
            return true;
        }
        else if ((menu == 'pessoa' && this.pessoa > 0) || this.admin == 1) {
            return true;
        }
        else if ((menu == 'grupo' && this.grupo > 0) || this.admin == 1) {
            return true;
        }
        else if (menu == 'local' && this.admin == 1) {
            return true;
        }
    }
    inicializa() {
        this.redirect = LoginPage;
        this.consumo = parseInt(localStorage.getItem('consumo'));
        this.dispositivo = parseInt(localStorage.getItem('dispositivo'));
        this.grupo = parseInt(localStorage.getItem('grupo'));
        this.pessoa = parseInt(localStorage.getItem('pessoa'));
        this.espaco = parseInt(localStorage.getItem('espaco'));
        if (this.consumo > 0) {
            this.redirect = ConsumoPage;
        }
        else if (this.grupo > 0) {
            this.redirect = ListGruposPage;
        }
        else if (this.pessoa > 0) {
            this.redirect = ListPessoasPage;
        }
        else if (this.espaco > 0) {
            this.redirect = ListEspacosPage;
        }
        else {
            this.methods.message("Você não tem permissão para acessar esse aplicativo!");
        }
        if (this.rootPage) {
            this.openPage(this.redirect);
        }
        else {
            this.rootPage = this.redirect;
        }
    }
    getName() {
        this.service.select('pessoa', {
            where: 'pessoa.id=' + localStorage.getItem('id')
        }).subscribe(function (data) {
            this.nome = data[0].nome;
            this.usuario = data[0].username;
        }, function (error) {
            console.log(error);
        });
    };
}

