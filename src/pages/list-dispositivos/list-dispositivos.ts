import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { DispositivoPage } from '../dispositivo/dispositivo';
import { PermissaoDispositivoPage } from '../permissao-dispositivo/permissao-dispositivo';

/**
 * Generated class for the ListDispositivosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-list-dispositivos',
  	templateUrl: 'list-dispositivos.html',
})
export class ListDispositivosPage {

	private id_espaco: number;

	private user_add: boolean;
	private user_edit: boolean;
	private user_del: boolean;
	private user_per: boolean;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private service: ServiceProvider, 
  				private methods: MethodsDefaultProvider, 
  				private modalCtrl: ModalController,
  				private viewCtrl: ViewController) {

  		this.id_espaco = this.navParams.get('id');
        this.findDispositivos();
        this.methods.checkPermission(parseInt(localStorage.getItem('dispositivo')));
        this.user_add = this.methods.user_add;
        this.user_edit = this.methods.user_edit;
        this.user_del = this.methods.user_del;
        this.user_per = this.methods.user_per;
  	}
  	findDispositivos(refresh = null) {
        if (refresh == undefined) {
            this.methods.loading('Aguarde...');
        }
        this.service.select('dispositivo', {
            'column': 'dispositivo.*,tipo_dispositivo.nome as tipo',
            'inner': [
                { 'table': 'tipo_dispositivo', 'foreign_key': 'dispositivo.id_tipo' }
            ],
            'where': 'dispositivo.id_espaco=' + this.id_espaco
        }).subscribe(function (data) {
            if (typeof data != "string") {
                this.dispositivos = data;
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
        var modal = this.modalCtrl.create(DispositivoPage);
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findDispositivos();
            }
        });
        modal.present();
    }
    editar(dispositivo, item) {
        item.close();
        var modal = this.modalCtrl.create(DispositivoPage, {
            id: dispositivo.id,
            nome: dispositivo.nome,
            id_tipo: dispositivo.id_tipo,
            id_espaco: dispositivo.id_espaco
        });
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findDispositivos();
            }
        });
        modal.present();
    }
    // Exclui as permissoes
    excluir(id) {
        this.methods.loading('Excluindo...');
        this.service.delete('permissao_dispositivo', {
            'id_dispositivo': id
        }).subscribe(function (data) {
            this.deleteDispositivo(id);
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    deleteDispositivo(id) {
        this.service.delete('dispositivo', { id: id })
            .subscribe(function (data) {
            this.methods.loader.dismiss();
            this.methods.message('Dispositivo excluido!');
            this.findDispositivos();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    refresh(pRefresh) {
        setTimeout(function () {
            this.findDispositivos(pRefresh);
        });
    }
    changeStatus(event, id) {
        this.methods.loading('Aguarde...');
        let status = 0;
        let ligado = "desligado";
        if (event.value) {
            status = 1;
            ligado = "ligado";
        }
        this.service.update('dispositivo', {
            'id': id,
            'status': status
        }).subscribe(function (data) {
            if (data['message']) {
                this.methods.message('Dispositivo ' + ligado + '.');
            }
            else {
                console.log(data);
                this.methods.message('Erro! Por favor tente novamente.');
            }
            this.methods.loader.dismiss();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    permissao(item, dispositivo) {
        item.close();
        let modal = this.modalCtrl.create(PermissaoDispositivoPage, {
            'id': dispositivo.id
        });
        modal.onDidDismiss(function (data) {
            if (data) {
                this.findDispositivos();
            }
        });
        modal.present();
    }
    alertConfirm(id, item) {
        item.close();
        this.methods.messageConfirm();
        if (this.methods.resultConfirm) {
            this.excluir(id);
        }
    }
    fechar() {
        this.viewCtrl.dismiss();
    }
}
