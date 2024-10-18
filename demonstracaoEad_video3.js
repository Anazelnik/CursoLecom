/*Globais Auxiliares*/
const codForm = ProcessData.processId
const codVersao = ProcessData.version
const codProcesso = ProcessData.processInstanceId
const codEtapa = ProcessData.activityInstanceId
const codCiclo = ProcessData.cycle
const tituloProcesso = ProcessData.title.replace(/\n /g, '')
const tituloEtapa = ProcessData.activityTitle.replace(/\n /g, '')
const BPM_URL = location.protocol + '//' + location.hostname + '/bpm'

/*Etapa*/
var Etapa = Object.freeze({
    INICIAR_SOLICITACAO: 2,
    ANALISAR_COMPRAS: 4,
    ANALISAR_GERAL: 6,
    ANALISAR_SOLICITACAO:3,
    EXECUTAR:5,
    FINALIZAR:1
  })

$(document).ready(function(){
    initForm();
    setForm();
});

/* inicialização das atividades */
function initForm() {
    //Switch case com as etapas declaradas na variavel etapa (Object.freeze)
    //Ex:
    switch (codEtapa) {
        case Etapa.INICIAR_SOLICITACAO:
            break
        default:
            break
    }
}

/* ações dos campos por atividade */
function setForm() {
    switch (codEtapa) {
        case Etapa.INICIAR_SOLICITACAO:
            //evento no botao aprovar.
            Form.actions("aprovar").subscribe("SUBMIT", function(itemId, action, reject) {
				validaInformacoes();
                var errors = Form.errors();
                if (Object.keys(errors).length)
                    reject();
            });

            Form.fields("ITENS").subscribe("GRID_ADD_AFTER", function () {
                somaValoresGrid();
            });

            Form.grids("ITENS").fields("DT_DATA").subscribe("BLUR",function(){
                validaDatas();
            });

            Form.fields("TXT_CEP").subscribe("BLUR",function(){
                prencheCamposEnd();
            });

            break
        default:
            break
    }
}

function prencheCamposEnd(){
	let cep = Form.fields("TXT_CEP").value();
    if(cep != ""){
	    $.ajax({
	        url: "https://viacep.com.br/ws/"+cep+"/json/",
	        type: 'GET',
			dataType: 'jsonp',
			crossDomain: true,
	        success: function (resposta) {
	            if (resposta.erro != null || resposta.erro != undefined) {
	                Form.fields("TXT_ENDERECO").value("");
	                Form.fields("TXT_CIDADE").value("");
	                Form.fields("TXT_ESTADO").value("");
	            } else {
	                Form.fields("TXT_ENDERECO").value(resposta.logradouro);
	                Form.fields("TXT_CIDADE").value(resposta.localidade);
	                Form.fields("TXT_ESTADO").value(resposta.uf);
	            }
				Form.apply();
	        },
	        error: function (error) {
	            console.error(error);
	        }
	    });
    }
}

function validaInformacoes(){
	var dadosGrid = Form.grids("ITENS");
	var linhasGrid = dadosGrid.dataRows();
	
	if(linhasGrid.length === 0){
		dadosGrid.errors("Adicione ao menos um item para seguir");
	}else{
		dadosGrid.errors("");
	}
	Form.apply();
}

function somaValoresGrid(){
    var vlrTotalGrid = Form.grids('ITENS').columns('MON_VALOR').sum();
    Form.fields('MON_TOTAL').value(vlrTotalGrid).apply();
}


function validaDatas() {
	var hj = new Date();

    var errorsForm = Form.errors();

    var data_venc = Form.grids("ITENS").fields("DT_DATA").value(); // 14/08/2019
    if (data_venc != null){
        var dtVenc = data_venc.split("/");
        var data2 = dtVenc[2]+"/"+dtVenc[1]+"/"+dtVenc[0];
        var valida_data_venc = new Date(data2);

        if (data_venc != null && valida_data_venc.getTime() > hj.getTime()) {
            Form.grids("ITENS").fields("DT_DATA").errors(['Data não pode ser maior que hoje']);
            Form.grids("ITENS").fields("DT_DATA").value("");
        }else{
            Form.grids("ITENS").fields("DT_DATA").errors([]);
            delete errorsForm["DT_OPCAO"];
        }
        Form.apply();
    }
}