/*

written by Jihoon Yoo <jihoon.yoo@utah.edu>

*/
var fs = require('fs');
var parse = require('csv-parse');
var parser = parse({
  delimiter: ','
}, function(err, data) {

  data.forEach(function(datum, index) {

    if (index == 0) {

      for (var i = 9; i < 69; i += 2) {
        var question_id = datum[i].substring(0, datum[i].indexOf(':'));
        questions.push(question_id);
      }
      console.log('questions:', questions.length);

    } else {

      var name = datum[0];
      var canvas_user_id = datum[1];
      var sis_user_id = datum[2];
      var root_account = datum[3];
      var section = datum[4];
      var section_id = datum[5];
      var section_sis_id = datum[6];
      var submitted = datum[7];
      var attempt = datum[8];
      var n_correct = datum[69];
      var n_incorrect = datum[70];
      var score = datum[71];

      // this user has full response records
      if ('1766264' === canvas_user_id) {

        // index 9 ~ 68 (30 questions), {'question', 'possible score'} ...
        for (var i = 9; i < 69; i += 2) {
          var responses = datum[i].split(',').map(function(response) {
            return response.substring(0, response.indexOf(':'));
          });

          // console.log(questions[(i - 9) / 2], '>>>', responses);
          wstream.write('\n');
          responses.forEach(function(response, index) {
            var record = [canvas_user_id, questions[(i - 9) / 2], index + 1, response].join();
            wstream.write(record + '\n');
            // console.log(record);
          })
        }
      }
    };
  });
  wstream.end();
});

var questions = [];
var wstream = fs.createWriteStream('final-report.csv');

wstream.write(['canvas_user_id', 'canvas_quiz_question_id', 'quetion_number', 'user_response'].join() + '\n');

fs.createReadStream('Quiz Student Analysis Report.csv').pipe(parser);
