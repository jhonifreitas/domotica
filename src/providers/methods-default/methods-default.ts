import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../service/service';

/*
  Generated class for the MethodsDefaultProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MethodsDefaultProvider {

	public resultConfirm:boolean = false;
    public consumo:number = 0;
    public dispositivo:number = 0;
    public grupo:number = 0;
    public pessoa:number = 0;
    public espaco:number = 0;

    public user_add: boolean;
    public user_edit: boolean;
    public user_del: boolean;
    public user_per: boolean;

    public toast: any;
    public loader: any;
    public alert: any;

  	constructor(private toastCtrl: ToastController,
  				private loadingCtrl: LoadingController,
  				private service: ServiceProvider,
  				private alertCtrl: AlertController) {
    
    }

    message(text) {
        this.toast = this.toastCtrl.create({
            message: text,
            duration: 4000,
            position: 'top'
        });
        this.toast.present();
    }
    loading(text) {
        this.loader = this.loadingCtrl.create({
            spinner: 'crescent',
            content: text
        });
        this.loader.present();
    }
    messageConfirm() {
        this.alert = this.alertCtrl.create({
            title: 'Atenção!',
            message: 'Deseja mesmo excluir?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: function () {
                        this.resultConfirm = false;
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        this.resultConfirm = true;
                    }
                }
            ]
        });
        this.alert.present();
    }
    getPermission() {
        this.service.select('grupo_pessoa as gp', {
            column: 'grupo.dispositivo, grupo.espaco, grupo.consumo, grupo.pessoa, grupo.grupo',
            inner: [
                { table: 'grupo', foreign_key: 'gp.id_grupo' }
            ],
            where: 'gp.id_pessoa=' + localStorage.getItem('id'),
        }).subscribe(function (data) {
            data.forEach(function (val) {
                if (val.consumo > this.consumo) {
                    this.consumo = val.consumo;
                }
                if (val.dispositivo > this.dispositivo) {
                    this.dispositivo = val.dispositivo;
                }
                if (val.espaco > this.espaco) {
                    this.espaco = val.espaco;
                }
                if (val.pessoa > this.pessoa) {
                    this.pessoa = val.pessoa;
                }
                if (val.grupo > this.grupo) {
                    this.grupo = val.grupo;
                }
            });
            localStorage.setItem('consumo', this.consumo.toString());
            localStorage.setItem('dispositivo', this.dispositivo.toString());
            localStorage.setItem('espaco', this.espaco.toString());
            localStorage.setItem('pessoa', this.pessoa.toString());
            localStorage.setItem('grupo', this.grupo.toString());
        }, function (error) {
            console.log(error);
        });
    }
    checkPermission(permissao) {
        if (parseInt(localStorage.getItem('admin')) != 1) {
            if (permissao == 2 || permissao == 8 || permissao == 11 || permissao == 14 || permissao == 17 || permissao == 20) {
                this.user_add = true;
            }
            if (permissao == 4 || permissao == 10 || permissao == 11 || permissao == 16 || permissao == 17) {
                this.user_edit = true;
            }
            if (permissao == 7 || permissao == 8 || permissao == 10 || permissao == 11 || permissao == 19 || permissao == 20 || permissao == 22) {
                this.user_del = true;
            }
            if (permissao >= 13) {
                this.user_per = true;
            }
        }
        else {
            this.user_add = true;
            this.user_edit = true;
            this.user_del = true;
            this.user_per = true;
        }
    }

}
