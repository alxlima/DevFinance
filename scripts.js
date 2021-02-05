const Modal ={ //[const Modal] - variavel constant- não muda futuramente [ Let Modal] - variavel que pode mudar
    open(){
        //Abrir modal
        //Adicionar a class active ao modal
        document //busco em todo documento HTML
        .querySelector('.modal-overlay') //  passando argumento classe="modal-overlay" devolve a referencia <div> de objetos.
        .classList // classList - a propriedade para listar objetos da lista . 
        .add('active') //[add ]-calsse(active), onde adiciono da minha lista de classes do modal overlay que entra no documento html.      
       //Testar função                        
        //alert('Abrir o modal') // [alert]- para testar exe fuction modal,['']-incluo argumento a minha funcionalidade
    },
    close(){
        //fechar o modal
        // remover a class active do madal
        document //busco em todo documento HTML
        .querySelector('.modal-overlay') //  passando argumento classe="modal-overlay" devolve a referencia <div> de objetos.
        .classList // classList - a propriedade para listar objetos da lista . 
        .remove('active') //[remove]-calsse(active), onde removo da minha lista de classes do modal overlay que entra no documento html.
    }
}

//Aplicando Armazenamento local no WebBrowsers
const Storage = {

    //pegar as informações
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] // se existir o [JSON.Parse]- transformo String em array, [ || ] ou [] -Array vazio
     //    console.log(localStorage)
    },
    //guardar as informações
    set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions)) //[JSON.stringify]--transformo array em strig
    }
 
 }

// Criando eventos para processar um transação.
const Transaction = {
       // criado array de dados de transações 
    all: Storage.get(),  // [Storage]- Utilizo o localStorage do Aplication -navegador WEB.
    
    /*[ // modelo de arry de trasactions
       {
           description:'Luz',
           amount: -50001,
           date:'23/01/2021',
       },
       {
           description:'Website',
           amount: 500000,
           date:'23/01/2021',
       },
       {
           description:'Internet',
           amount: -20012,
           date:'23/01/2021',
       },
       {
           description:'App',
           amount: 200000,
           date:'23/01/2021',
       },
   ], */

    //adiciono transaction
    add(transaction){
        Transaction.all.push(transaction)

       /// console.log(Transaction.all)//para Testar
       App.reload()
    },

    //removendo transaction
    remove(index){
       Transaction.all.splice(index,1) // [splice] - metodo para array. espera o numero position 
                                     // [index,1] - deleto um elemento na posição
       App.reload()// chama rotina para atualizar pag.                               
    },

    incomes(){
       //somar as entradas
       let income = 0;
       //pegar todas as trasacoes
       //Para cada transacao,
       Transaction.all.forEach((transaction)=>{ //=> HeroFunction de function
        // se ele for maior que zero 
        if(transaction.amount > 0){
            // somar a uma variavel e retornar a variavel  soma das entradas
            income += transaction.amount;  // entra income =0 na segunda 0 + 1  demais entradas  
        }

       }) 
      return income;
    },

    expenses(){
      //somar as saidas
       //somar as entradas
       let expenses = 0;
       //pegar todas as trasacoes
       //Para cada transacao,
       Transaction.all.forEach((transaction)=>{ //=> HeroFunction de function
        // se ele for menor que zero 
        if(transaction.amount < 0){
          // somar a uma variavel e retornar a variavel  soma das entradas
          expenses += transaction.amount;  //entra expenses =0 na segunda 0 + 1  demais entradas  
        }
       }) 
      return expenses;
    },

    total (){
      // calculo total, pegando valores das (Entradas - saidas )
      return Transaction.incomes() + Transaction.expenses(); //[+] por que saidas= sinal [-] , - com + = -

    }    
} 

// Substituir os dados do HTML com os dados do JS 
const DOM = { //documento objeto model
    transactionsContainer: document.querySelector('#data-table tbody'), //busco meu container de TR da tBody

    addTransaction(transaction, index){ //adiciono criação do tr busco return html
        // console.log('Chequei aqui')// testar função
        const tr = document.createElement('tr')
        tr.innerHTML =DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr) //adiciono objetos filhos dentro do container data-table tbody
        // console.log(tr.innerHTML)//testar add do html trasaction 
    },

    innerHTMLTransaction(transaction, index){ //criar substituição objeto transaction do HTML
        //defino tratativa tipo de transaction valores [-]income ou [+]expense 
        const CSSclass = transaction.amount > 0 ? "income" : "expense" //se > 0 ="income" [?]-senão expense 
         
        const amount = Utils.formatCurrency(transaction.amount)// chamo a função para conversar valores moeda

        const html= `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
         `
         return html
    },

    //Para atualizar valores dos Card's. Entrada/Saidas/ Total
    updateBalance() { 
    // busco o elemento pelo ID criado no html
       document
           .getElementById('incomeDisplay')
           //.innerHTML = Transaction.incomes()//sem formatação valor Moeda BR
           .innerHTML = Utils.formatCurrency(Transaction.incomes())//Utils.formatCurrency()- function format valor moeda
       document
           .getElementById('expenseDisplay')
           .innerHTML = Utils.formatCurrency(Transaction.expenses())
       document
           .getElementById('totalDisplay')
           .innerHTML = Utils.formatCurrency(Transaction.total())
    
    },

    //para limpar as transaction, populadas durante App init
    clearTransactions(){
       DOM.transactionsContainer.innerHTML = "" // passo vazio para as <Tbody> tabelas
    }
}
  
 //Aplicando a formatação campo valores em moeda e Sinal[-]
const Utils = {
    formatAmount(value){
      value = Number(value.replace(/\,\./g,"")) * 100 // se digitar value 8.00, *100 = 800

    //    console.log(value)// para testar
     return(value)
    },

    formatDate(date){
       const splittedDate = date.split("-") // [spliteedDate]- separador de formato data aplicando string.
                                            //position[0] 2021-Ano, position=[1]- 02-Mes, position[2]- 03-dia
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        // console.log(splittedDate) // para testar
    },

    formatCurrency(value) {
        // tranformando o value em numero
        const signal = Number(value) < 0 ? "-" : "" // se number < 0 [?]-Então valor é [-], [:]-senão , valor é "" nenhum sinal
    
       //transformo o numero em uma string
       //value = String(value).replace(/\D/,"Sinal_Negativo ")//testar value onde tem o sinal [-]
       value = String(value).replace(/\D/,"")// transformo todos os valores numeros por string se
       
       value = Number(value)/100 // transformo o numero 50001 em 500,01 

       value = value.toLocaleString("pt-BR", {  // toLocaeString - funcionalidade local moeda.
               style:"currency", // currency = estilo moeda
               currency:"BRL", // tipo real brasileiro
       })
       // para testar campos de valores
       //console.log(value) 
       //console.log(signal + value) //cancatenho valor e signal ja formatado.
       return signal + value  // retorno concatenado o sinal[-]ou[] + value [R$]valor moeda formatado.
    }
} 

const Form = {
  // likando o JS , buscando o meu Doc Html os elementos id 
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  // guardo os valores
  getValues() {
      return {
          description: Form.description.value,
          amount: Form.amount.value,
          date: Form.date.value
      }
  },

 validateFields(){
   const {description, amount, date} = Form.getValues()
   
    if( description.trim() ==="" || // [trim]- pego se o elemento valores vazio, [||]-ou proximo elemento.
        amount.trim() ==="" ||
        date.trim() ==="" ){
            throw new Error("Por favor, preencha todos os campos") // trrow- retorno e crio um objeto de erro   
   }     
    //console.log(description)
    //console.log(Form.getValues())
    //console.log('Validar os campos')
 },  

 formatValues() {
    let { description, amount, date } = Form.getValues()// altero Const, para Let pois é possivel alterar valores
    
    amount = Utils.formatAmount(amount) 

    date = Utils.formatDate(date)

    return{
       description,
       amount,
       date
    }

   // console.log(date) // para testar  
 },

 clearFiels(){
     Form.description.value = "" 
     Form.amount.value =""
     Form.date.value =""
 },

  submit(event){ //retorno parametro do evento html form
    event.preventDefault() //interrompo comportamento padrão por defalt, possibilita instruir os mesmos.
   //console.log(event)
    
   try { // [try] - Tenta executar todos os passos

        // Verificar se todas as informações foram preenchidas
        Form.validateFields()
        // Formatar os dados para salvar
        const transaction = Form.formatValues()
        // Salvar 
        Transaction.add(transaction)
        // Apagar os dados do formulario
        Form.clearFiels()
        // Fechar o form Modal
        Modal.close()
        // Atualizar a aplicação
        // App.reload()//comentei aqui, pois ja inclui app.reload no Add(transaction)
    } catch (error){ // caso falhar cai no erro
        alert(error.message) // [alert]- comando do browser(pag-html), passo paramentro error.Message text
    }

  }
}

// Preparo as transaction adicionado e atualizando na posição para exibir na pagina Html
const App = {
    init(){     
        //DOM.addTransaction(transactions[0]) --passando manual, posição 0
        //DOM.addTransaction(transactions[1])
        //DOM.addTransaction(transactions[2])
        // testar for passando numero de posição para o trasaction, aqui passo 3 posição
        //for (let i=0; i < 3; i++){
        //   console.log(i)
        //   DOM.addTransaction(transactions[i])
        //}
        Transaction.all.forEach(function(transaction, index){
            DOM.addTransaction(transaction, index) //adiciono todas transation que existem apresentando na pagina
        })

        DOM.updateBalance() //Atualizo os Cargs, entradas/saidas/total  

        Storage.set(Transaction.all)//Salvo registros no LocalStorage - Nav. Webrowser
    },

    reload(){ //Atualiza pagina
      DOM.clearTransactions()  // limpo as trasaçtions
      App.init() // inicio carregamento das transaction
    },
}

//Execução inicio transaction (adicionar/Atualizar)
App.init() 

//Execução inicio transaction (remover)
//Transaction.remove(4)

///Dica Git, caso voce deletar sem querer um arquivo se
// pelo terminal, com git instalado e tendo um repositorio iniciado
//digitar command: git checkout -- style.css
//Obs: cuidado por que vai buscar a ultima atualizaçao que teve commit.