var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
      function(quiz) {
		 if (quiz) {
		   req.quiz = quiz;
		   next();
		 } else{next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
};


//GET /quizes
exports.index = function(req, res) {
	var search="";

	if (req.query.search) {
		search = '%' + req.query.search.replace(/\s+/g,"%") + '%';	
		
		console.log('PARAMETRO SEARCH = ' + search);
	
		models.Quiz.findAll(
			{ where: ["upper(pregunta) like ?", search.toUpperCase()] }
		).then(function(quizes){	
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}).catch(function(error){ next(error); });

	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	}


};



//GET /quizes/question
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	} 
	
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
	
};
