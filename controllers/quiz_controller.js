var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error("No existe quizId=" + quizId));
			}

		}).catch(function(error) {next(error);})
};

//GET /quizes
exports.index = function(req, res){
	var consulta = req.query.search || "";
	consulta = ('%' + consulta + '%').replace(/ /g,'%');

    models.Quiz.findAll({where: ["pregunta like ?", consulta], order:[["pregunta", "ASC"]]}
    	  ).then(function(quizes) {
    			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  		  }).catch(function(error) {next(error);});	
};


//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz, errors: []});	
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = "Incorrecto";
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	} 
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({pregunta: "pregunta", respuesta: "respuesta"}); 

	res.render('quizes/new', {quiz: quiz, errors: []});

};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			quiz
			.save({fields: ["pregunta", "respuesta"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

//GET /quizes/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; 

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	quiz
	.validate()
	.then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz
			.save({fields: ["pregunta", "respuesta"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});

};

//DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz.destroy()
	then(function() {
		res.redirect('/quizes');
	})
	.catch(function(error) {next(error);});
};

//GET /author
exports.author = function(req, res){
	res.render('author');
}