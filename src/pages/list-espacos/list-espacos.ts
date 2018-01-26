import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { EspacoPage } from '../espaco/espaco';
import { ListDispositivosPage } from '../list-dispositivos/list-dispositivos';

/**
 * Generated class for the ListEspacosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-list-espacos',
  	templateUrl: 'list-espacos.html',
})
export class ListEspacosPage {

	private user_add: boolean;
	private user_edit: boolean;
	private user_del: boolean;
	private user_disp: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private service: ServiceProvider, 
  				private methods: MethodsDefaultProvider, 
  				private modalCtrl: ModalController) {

  		this.findEspacos();
        this.methods.checkPermission(parseInt(localStorage.getItem('espaco')));
        this.user_add = this.methods.user_add;
        this.user_edit = this.methods.user_edit;
        this.user_del = this.methods.user_del;
        this.user_disp = parseInt(localStorage.getItem('dispositivo')) > 0 || parseInt(localStorage.getItem('admin')) == 1;
  	}
  	findEspacos(refresh = null) {
        if (refresh == undefined) {
            this.methods.loading("Aguarde...");
        }
        this.service.select('espaco')
            .subscribe(function (data) {
            if (typeof data != "string") {
                this.espacos = data;
                if (refresh == undefined) {
                    this.methods.loader.dismiss();
                }
                else {
                    refresh.complete();
                }
            }
        }, function (error) {
            console.log(error);
            if (refresh == undefined) {
                this.methods.loader.dismiss();
            }
            else {
                refresh.complete();
            }
        });
    }
    inserir() {
        var modal = this.modalCtrl.create(EspacoPage);
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findEspacos();
            }
        });
        modal.present();
    }
    editar(id, nome, item) {
        item.close();
        var modal = this.modalCtrl.create(EspacoPage, { id: id, nome: nome });
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findEspacos();
            }
        });
        modal.present();
    }
    excluir(id) {
        this.methods.loading("Excluindo...");
        this.service.delete('espaco', { id: id })
            .subscribe(function (data) {
            this.methods.loader.dismiss();
            this.methods.message('Espaço excluido!');
            this.findEspacos();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    refresh(pRefresh) {
        setTimeout(function () {
            this.findEspacos(pRefresh);
        });
    }
    alertConfirm(id, item) {
        item.close();
        this.methods.messageConfirm();
        if (this.methods.resultConfirm) {
            this.excluir(id);
        }
    }
    openDispositivo(espaco) {
        if (this.user_disp) {
            var modal = this.modalCtrl.create(ListDispositivosPage, { id: espaco.id });
            modal.present();
        }
    }

}
