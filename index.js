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
        canvas_quiz_question_ids.push(datum[i].split('\n')[0]);
        unique_question_ids.push(datum[i].split('\n')[1]);
      }

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

      // index 9 ~ 68 (30 questions), {'question', 'possible score'} ...
      for (var i = 9; i < 69; i += 2) {
        var responses = datum[i].split(',').map(function(response) {
          return response.substring(0, response.indexOf(':'));
        });

        // console.log(questions[(i - 9) / 2], '>>>', responses);
        wstream.write('\n');
        var question_idx = (i - 9) / 2;
        responses.forEach(function(response, index) {
          var record = [canvas_user_id, canvas_quiz_question_ids[question_idx],
            unique_question_ids[question_idx], index + 1, response
          ].join();
          wstream.write(record + '\n');
          // console.log(record);
        })
      }
    }
  });

  wstream.end();
});

var canvas_quiz_question_ids = [];
var unique_question_ids = [];
var wstream;

if (process.argv.length == 3) {

  wstream = fs.createWriteStream('final-report.csv');
  wstream.write(['canvas_user_id', 'canvas_quiz_question_id', 'unique_question_id', 'question_number', 'user_response'].join() + '\n');

  var input_file = process.argv[2];
  fs.createReadStream(input_file).pipe(parser);

} else {
  console.log('Usage: node index.js {input_file.csv}');
}
