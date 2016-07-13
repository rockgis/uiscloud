var _spark = {};
_spark.jobs = {};
_spark.stages = {};

function spark(type){
	var url = '';
	if(type == 'jobs'){
		_spark.jobs.get('/spark/jobs.n');
	} else if(type == 'stages'){
		_spark.stages.get('/spark/stages.n');
	}
}

_spark.jobs.get = function(url){
	$.ajax({
		type : 'GET',
		url : url,
		datatype : 'html',
		data : {
		},
		beforeSend : function() {
		},
		success : function(data) {
			$('#div_contents').empty().html(data);
			$('#div_contents').show();
		},
		error : function() {
		}
	});
};

_spark.stages.get = function(url){
	$.ajax({
		type : 'GET',
		url : url,
		datatype : 'html',
		data : {
		},
		beforeSend : function() {
		},
		success : function(data) {
			$('#div_contents').empty().html(data);
			$('#div_contents').show();
		},
		error : function() {
		}
	});
};