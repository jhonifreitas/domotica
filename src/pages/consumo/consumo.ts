import { ViewChild, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { Chart } from 'chart.js';

/**
 * Generated class for the ConsumoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-consumo',
  	templateUrl: 'consumo.html',
})
export class ConsumoPage {

    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    
    barChart: any;
    doughnutChart: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private methods: MethodsDefaultProvider, 
  				private service: ServiceProvider) {
  	
  	}

  	ionViewDidLoad(refresh) {
        if (refresh == undefined) {
            this.methods.loading('Aguarde...');
        }
        // SELECT DAY(c.created) dia, MONTH(c.created) mes, SUM(c.amperes) amperes ,ROUND(TIMESTAMPDIFF(SECOND, MIN(c.created), MAX(c.created))/3600, 2) horas
        // from consumo c
        // group by DAY(c.created), MONTH(c.created), YEAR(c.created)
        this.service.select('consumo c', {
            'column': 'DAY(c.created) dia, MONTH(c.created) mes, SUM(c.amperes) amperes ,ROUND(TIMESTAMPDIFF(SECOND, MIN(c.created), MAX(c.created))/3600, 2) horas',
            'extra': 'GROUP BY DAY(c.created), MONTH(c.created), YEAR(c.created)'
        }).subscribe(function (data) {
            this.load(data, refresh);
        }, function (error) {
            console.log(error);
            if (refresh) {
                refresh.complete();
            }
            else {
                this.methods.loader.dismiss();
            }
        });
    }
    load(data, refresh) {
        // DADOS AMPERES
        var dados_amperes = {
            labels: [],
            datasets: [{
                    label: '',
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }]
        };
        // REAIS
        var dados_gasto = {
            labels: [],
            datasets: [{
                    label: ['R$'],
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 2
                }]
        };
        data.forEach(function (val) {
            // AMPERES
            dados_amperes.labels.push(val.dia);
            dados_amperes.datasets[0].data.push(val.amperes);
            var num1 = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
            var num2 = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
            var num3 = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
            var color_trans = 'rgba(' + num1 + ',' + num2 + ',' + num3 + ',0.7)';
            var color = 'rgb(' + num1 + ',' + num2 + ',' + num3 + ')';
            dados_amperes.datasets[0].backgroundColor.push(color_trans);
            dados_amperes.datasets[0].hoverBackgroundColor.push(color);
            // REAIS
            var valor = val.amperes;
            valor = valor * 220 / 1000; // Kilowatts
            valor = valor * val.horas; // Vezes horas
            var dias = (val.horas / 24) + 1;
            valor = valor * dias; // Vezes dias
            valor = valor * 0.35; // Valor Kilowatt/hora
            dados_gasto.labels.push(val.dia);
            valor = parseFloat(valor.toFixed(2));
            // dados_gasto.datasets[0].label.push(valor);
            console.log(valor);
            dados_gasto.datasets[0].data.push(valor);
            var color_trans2 = 'rgba(' + num1 + ',' + num2 + ',' + num3 + ',0.5)';
            dados_gasto.datasets[0].backgroundColor.push(color_trans2);
            dados_gasto.datasets[0].borderColor.push(color);
        });
        // GRAFICO AMPERES
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: dados_amperes
        });
        // GRAFICO REAIS
        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: dados_gasto
        });
        if (refresh != undefined) {
            refresh.complete();
        }
        else {
            this.methods.loader.dismiss();
        }
    }
    refresh(pRefresh) {
        setTimeout(function () {
            this.ionViewDidLoad(pRefresh);
        });
    }

}
