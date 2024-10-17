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
let Etapa = Object.freeze({
    SOLICITAR_VIAGEM: 2,
    APROVACAO_DO_GESTOR: 4,
    AGENDAR_DEPOSITO_ADIANTAMENTO: 6,
    ANALISAR_ADIANTAMENTO:3,
    REALIZAR_COTACAO:5,
    FIM_DA_SOLICITACAO:1
  })

$(document).ready(function(){
    initForm();
    setForm();
});

/* inicialização das atividades */
// Grid 1 : Realizar cotação > VALOR_DA_PASSAGEM 
// Grid 2 : Realizar cotação > VALOR_HOSPEDAGEM 
// Grid 3 : Prestar Contas > VALOR_TOTAL_DESPESA

function initForm() {
    //Switch case com as etapas declaradas na variavel etapa (Object.freeze)
    //Ex:
    switch (codEtapa) {
        case Etapa.REALIZAR_COTACAO:
            break
        default:
            break
    }
}

function setForm() {
    switch (codEtapa) {
        case Etapa.REALIZAR_COTACAO:
            Form.fields("PASSAGENS").subscribe("VALOR_DA_PASSAGEM", function () {
                somaValoresGrid();
            });
            
            
            Form.fields("HOSPEDAGEM").subscribe("VALOR_HOSPEDAGEM", function () {
                somaValoresGrid();
            });

            break
        default:
            break
    }
}

function somaValoresGrid(){
    let vlrTotalGrid = Form.grids("PASSAGENS", "HOSPEDAGEM", "DESPESAS").columns("VALOR_DA_PASSAGEM", "VALOR_HOSPEDAGEM", "VALOR_DA_DESPESA").sum();
    Form.fields("VALOR_TOTAL_DESPESA").value(vlrTotalGrid).apply();
}




