const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars'); //Templates
const app=express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3306
});

// Selecionar banco de dados a usar
sql.query("use node_um");

// Selecionar o diretório das imagens
app.use("/img", express.static("img"));
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

//Template engine
app.engine("handlebars", handlebars({defaultlayout: 'main'}));
app.set('view engine','handlebars');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));



// Rotas e Templates
app.get("/",function(req,res){
    /*res.send("Essa é minha página inicial")*/
    /*res.sendFile(__dirname+"index.html");*/
    res.render('index');
});

// Link para o inserir
app.get("/inserir",function(req,res){
    res.render('inserir')
})

// Link para a select
app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from user order by id asc", function(error, results, fields){
            res.render("select", {data:results});
        });
    }
    else{
        sql.query("select * from user where id=? order by id asc", [req.params.id], function(error, results, fields){
            res.render("select", {data:results});
        });
    }
    
})

// Inserir dados no banco de dados
app.post("/controllerForm", urlencodeParser,function(req,res){
    sql.query("insert into user values (?, ?, ?)", [req.body.id, req.body.nome, req.body.idade]);
    res.render('controllerForm', {name: req.body.nome}); 
} );

//Rota para deletar
app.get("/deletar/:id", function(req, res){
    sql.query("delete from user where id=?", [req.params.id]);
    res.render("deletar");
});

// Rota para fazer update
app.get("/update/:id", function(req, res){
    sql.query("select * from user where id=?", [req.params.id], function(err, results, fields){
        res.render("atualizar", {id:req.parms.id, nome:results[0].nome, idade:results[0].idade});
    });
});

// Rota para fazer o post da atualização do formulário
app.post("/controllerUpdate", urlencodeParser, function(req, res){
    sql.query("update user set nome=?, idade=?, where id=?", [req.body.name, req.body.idade, req.body.id]);
    res.render("controllerUpdate")
});

// Começar o servidor
app.listen(3000, function(req,res){
    console.log('Servidor está funcionando!');
});