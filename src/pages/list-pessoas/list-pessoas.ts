import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { GrupoPessoaPage } from '../grupo-pessoa/grupo-pessoa';
import { PessoaPage } from '../pessoa/pessoa';

/**
 * Generated class for the ListPessoaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-list-pessoas',
  	templateUrl: 'list-pessoas.html',
})
export class ListPessoasPage {

	private user_add: boolean;
	private user_edit: boolean;
	private user_del: boolean;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private service: ServiceProvider, 
  				private methods: MethodsDefaultProvider,
  				private modalCtrl: ModalController,
  				private popoverCtrl: PopoverController) {

  		this.findPessoa();
        this.methods.checkPermission(parseInt(localStorage.getItem('pessoa')));
        this.user_add = this.methods.user_add;
        this.user_edit = this.methods.user_edit;
        this.user_del = this.methods.user_del;
  	}
  	findPessoa(refresh = null) {
        if (refresh == undefined) {
            this.methods.loading("Aguarde...");
        }
        this.service.select('pessoa')
            .subscribe(function (data) {
            if (typeof data != "string") {
                this.pessoas = data;
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
        var modal = this.modalCtrl.create(PessoaPage);
        modal.onDidDismiss(function (data) {
            this.findPessoa();
        });
        modal.present();
    }
    editar(pessoa, item) {
        item.close();
        var modal = this.modalCtrl.create(PessoaPage, { pessoa: pessoa });
        modal.onDidDismiss(function (data) {
            this.findPessoa();
        });
        modal.present();
    }
    deletePessoa(id) {
        this.service.delete('pessoa', {
            'id': id
        }).subscribe(function (data) {
            this.methods.loader.dismiss();
            this.findPessoa();
            this.methods.message('Sucesso! Pessoa excluida.');
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    excluir(id) {
        this.methods.loading("Excluindo...");
        this.service.delete('grupo_pessoa', {
            'id_pessoa': id
        }).subscribe(function (data) {
            this.deletePessoa(id);
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
        });
    }
    refresh(pRefresh) {
        setTimeout(function () {
            this.findPessoa(pRefresh);
        });
    }
    openPopover(myEvent, id) {
        var popover = this.popoverCtrl.create(GrupoPessoaPage, { id: id });
        popover.present({
            ev: myEvent
        });
    }
    alertConfirm(id, item) {
        item.close();
        this.methods.messageConfirm();
        if (this.methods.resultConfirm) {
            this.excluir(id);
        }
    }
    alt_senha(pessoa, item) {
        item.close();
        var modal = this.modalCtrl.create(PessoaPage, { pessoa: pessoa, senha: true });
        modal.onDidDismiss(function (data) {
            this.findPessoa();
        });
        modal.present();
    }

}
