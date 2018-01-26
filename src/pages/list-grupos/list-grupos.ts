import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { GrupoPage } from '../grupo/grupo';

/**
 * Generated class for the ListGruposPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-list-grupos',
    templateUrl: 'list-grupos.html',
})
export class ListGruposPage {

	private user_add: boolean;
	private user_edit: boolean;
	private user_del: boolean;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private service: ServiceProvider, 
  				private methods: MethodsDefaultProvider,
  				private modalCtrl: ModalController) {

  		this.findGrupos();
        this.methods.checkPermission(parseInt(localStorage.getItem('grupo')));
        this.user_add = this.methods.user_add;
        this.user_edit = this.methods.user_edit;
        this.user_del = this.methods.user_del;
  	}
  	findGrupos(refresh = null) {
        if (refresh == undefined) {
            this.methods.loading("Aguarde...");
        }
        this.service.select('grupo')
            .subscribe(function (data) {
            if (typeof data != "string") {
                this.grupos = data;
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
        var modal = this.modalCtrl.create(GrupoPage);
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findGrupos();
            }
        });
        modal.present();
    }
    editar(grupo, item) {
        item.close();
        var modal = this.modalCtrl.create(GrupoPage, { grupo: grupo });
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findGrupos();
            }
        });
        modal.present();
    }
    excluir(id) {
        this.methods.loading("Excluindo...");
        this.service.delete('grupo', { id: id })
            .subscribe(function (data) {
            this.methods.loader.dismiss();
            this.methods.message('Sucesso! Grupo excluido.');
            this.findGrupos();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message("Erro! Por favor verifique os dispositivos e pessoas ligadas ao grupo.");
        });
    }
    alertConfirm(id, item) {
        item.close();
        this.methods.messageConfirm();
        if (this.methods.resultConfirm) {
            this.excluir(id);
        }
    }
    refresh(pRefresh) {
        setTimeout(function () {
            this.findGrupos(pRefresh);
        });
    }
}
