import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the GrupoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-grupo',
  	templateUrl: 'grupo.html',
})
export class GrupoPage {

	private grupo: any;
	private opcoes: any;
    private  parametro: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
                private formBuilder: FormBuilder,
                private methods: MethodsDefaultProvider,
                private service: ServiceProvider,
                private viewCtrl: ViewController) {

  		this.grupo = this.formBuilder.group({
            id: [''],
            nome: ['', Validators.required],
            consumo: [false],
            dispositivo: [{ value: [], disabled: true }],
            grupo: [{ value: [], disabled: true }],
            pessoa: [{ value: [], disabled: true }],
            espaco: [{ value: [], disabled: true }],
            check_dispositivo: [false],
            check_grupo: [false],
            check_pessoa: [false],
            check_espaco: [false],
        });
        if (this.navParams.get('grupo')) {
            this.parametro = this.navParams.get('grupo');
            this.grupo.controls.id.setValue(this.parametro.id);
            this.grupo.controls.nome.setValue(this.parametro.nome);
            if (this.parametro.consumo == 1) {
                this.grupo.controls.consumo.setValue(true);
            }
            if (this.parametro.dispositivo > 0) {
                this.grupo.controls.dispositivo.enable();
                this.grupo.controls.check_dispositivo.setValue(true);
                let value = this.convertValue(this.parametro.dispositivo);
                this.grupo.controls.dispositivo.setValue(value);
            }
            if (this.parametro.grupo > 0) {
                this.grupo.controls.grupo.enable();
                this.grupo.controls.check_grupo.setValue(true);
                let value = this.convertValue(this.parametro.grupo);
                this.grupo.controls.grupo.setValue(value);
            }
            if (this.parametro.pessoa > 0) {
                this.grupo.controls.pessoa.enable();
                this.grupo.controls.check_pessoa.setValue(true);
                let value = this.convertValue(this.parametro.pessoa);
                this.grupo.controls.pessoa.setValue(value);
            }
            if (this.parametro.espaco > 0) {
                this.grupo.controls.espaco.enable();
                this.grupo.controls.check_espaco.setValue(true);
                let value = this.convertValue(this.parametro.espaco);
                this.grupo.controls.espaco.setValue(value);
            }
        }
        this.opcoes = [
            { value: 1, nome: 'Adicionar' },
            { value: 3, nome: 'Editar' },
            { value: 6, nome: 'Excluir' }
        ];
  	}
    save() {
        this.methods.loading("Aguarde...");
        var dados = {
            'id_local': localStorage.getItem('id_local'),
            'nome': this.grupo.value.nome,
            'consumo': 0,
            'dispositivo': 0,
            'grupo': 0,
            'pessoa': 0,
            'espaco': 0
        };
        if (this.grupo.value.consumo) {
            dados.consumo = 1;
        }
        if (this.grupo.value.check_dispositivo) {
            dados.dispositivo = 1;
            if (this.grupo.value.dispositivo) {
                this.grupo.value.dispositivo.forEach(function (val) { return dados.dispositivo += parseInt(val); });
            }
        }
        if (this.grupo.value.check_grupo) {
            dados.grupo = 1;
            if (this.grupo.value.grupo) {
                this.grupo.value.grupo.forEach(function (val) { return dados.grupo += parseInt(val); });
            }
        }
        if (this.grupo.value.check_pessoa) {
            dados.pessoa = 1;
            if (this.grupo.value.pessoa) {
                this.grupo.value.pessoa.forEach(function (val) { return dados.pessoa += parseInt(val); });
            }
        }
        if (this.grupo.value.check_espaco) {
            dados.espaco = 1;
            if (this.grupo.value.espaco) {
                this.grupo.value.espaco.forEach(function (val) { return dados.espaco += parseInt(val); });
            }
        }
        if (this.grupo.value.id) {
            dados['id'] = this.grupo.value.id;
            this.service.update('grupo', dados)
                .subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.getPermission();
                this.methods.message('Grupo salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message('Erro! Por favor tente novamente');
            });
        }
        else {
            this.service.insert('grupo', dados)
                .subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.getPermission();
                this.methods.message('Grupo salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message('Erro! Por favor tente novamente');
            });
        }
    }
    habilitar(event, opcao) {
        if (event.value == 1) {
            if (opcao == 'dispositivo') {
                this.grupo.controls.dispositivo.enable();
                if (this.grupo.value.dispositivo.length == 0) {
                    this.grupo.controls.dispositivo.setValue([1]);
                }
            }
            else if (opcao == 'grupo') {
                this.grupo.controls.grupo.enable();
                if (this.grupo.value.grupo.length == 0) {
                    this.grupo.controls.grupo.setValue([1]);
                }
            }
            else if (opcao == 'pessoa') {
                this.grupo.controls.pessoa.enable();
                if (this.grupo.value.pessoa.length == 0) {
                    this.grupo.controls.pessoa.setValue([1]);
                }
            }
            else if (opcao == 'espaco') {
                this.grupo.controls.espaco.enable();
                if (this.grupo.value.espaco.length == 0) {
                    this.grupo.controls.espaco.setValue([1]);
                }
            }
        }
        else {
            if (opcao == 'dispositivo') {
                this.grupo.controls.dispositivo.disable();
            }
            else if (opcao == 'grupo') {
                this.grupo.controls.grupo.disable();
            }
            else if (opcao == 'pessoa') {
                this.grupo.controls.pessoa.disable();
            }
            else if (opcao == 'espaco') {
                this.grupo.controls.espaco.disable();
            }
        }
    }
    // Permissões
    // 0 - desabilitado
    // 1 - habilitado
    // 1 - adicionar
    // 3 - editar
    // 6 - excluir
    // 12 - permissao
    convertValue(value) {
        var result = [];
        if (value == 2) {
            result = [1];
        }
        if (value == 4) {
            result = [3];
        }
        if (value == 7) {
            result = [6];
        }
        if (value == 13) {
            result = [12];
        }
        if (value == 8) {
            result = [1, 6];
        }
        if (value == 10) {
            result = [3, 6];
        }
        if (value == 11) {
            result = [1, 3, 6];
        }
        if (value == 14) {
            result = [1, 12];
        }
        if (value == 16) {
            result = [3, 12];
        }
        if (value == 17) {
            result = [1, 3, 12];
        }
        if (value == 19) {
            result = [6, 12];
        }
        if (value == 20) {
            result = [1, 6, 12];
        }
        if (value == 22) {
            result = [3, 6, 12];
        }
        return result;
    }
    fechar() {
        this.viewCtrl.dismiss();
    }
}
