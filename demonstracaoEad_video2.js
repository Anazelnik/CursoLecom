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

            break
        default:
            break
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