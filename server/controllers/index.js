var indexCtrl = require ("../service/index");
module.exports=function(app){
	app.get('/',function(req,res){
		res.redirect('/index.html');
	});
	app.get('/index.html',indexCtrl.getIndex)
	app.get('/detail.html',function(req,res){
		res.send('this is a message');
	})
}
