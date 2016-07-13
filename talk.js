var INFO = {
	questionWords : ["what", "why", "how", "where", "when", "which", "who"],
	verbs : ["does", "do", "is", "am", "are", "has", "have", "will", "shall", 
			"had", "did", "would", "could"],
	greetingWords : ["hello", "hi", "hey", "yo", "good morning", "good evening",
					"evening", "morning"],
	responses : ["hmmm", "ok", "oh", "I see", "ahh"],

	iWords : ["i", "my", "me", "mine"],
	youWords : ["you", "your", "yours"],

	goodBye : ["good bye", "I need to go", "bye", "see ya", "later"]
};

var dict = {
	qFine : ["fine", "good", "okay"],
	qWish : ["want", "Wish"]
};

var prev = {
	state: "",
	reply : "",
	mood : ""
};

var curr = {

}


function load(){
	document.getElementById("play").style.visibility = "hidden";
	document.getElementById("ans").style.visibility = "visible";
	document.getElementById("reply").innerHTML = "Hello, I'm Pearl!";
}


function talk(){
	var question = document.getElementById("question").value;
	document.getElementById("question").value = "";
	var analysis = breakSentence(question);
	document.getElementById("reply").innerHTML = analysis.ans;
	document.getElementById("pic").src = "princess_"+analysis.mood+".jpg";
	prev.reply = ans;
	prev.mood = analysis.mood;
	prev.state = curr.state;
	console.log(analysis);

}


function breakSentence(question){
	var analysis = {
		question: question,
		words: question.split(" "),
		greeting: false,
		mood : "normal"
	};

	analysis.isQuestion = (question.includes("?"))?true : false;

	for(var k=0; k < INFO.goodBye.length; ++k){
		if(question.toLowerCase().includes(INFO.goodBye[k])){
			analysis.ans = INFO.goodBye[Math.floor(Math.random() * INFO.goodBye.length)];
			return analysis;
		}
	}


	for( var i=0; i < INFO.questionWords.length; ++i){
		if(analysis.question.toLowerCase().includes(INFO.questionWords[i])){
			analysis.isQuestion = true;
			analysis.Q = {};
			analysis.Q.qWord = INFO.questionWords[i];
			break;
		}
	}

	if(!analysis.isQuestion){
		for(i=0; i< INFO.verbs.length; ++i){
			if(analysis.words[0].toLowerCase() == INFO.verbs[i]){
				analysis.isQuestion = true;
				analysis.Q.qWord = INFO.verbs[i];

				break;
			}
		}
	}

	if(analysis.question[question.length-1]=="."){
		analysis.isQuestion = false;
	}

	for(var j=0; j < INFO.greetingWords.length; ++j){
		if(analysis.words[0].toLowerCase()==INFO.greetingWords[j]){
			analysis.greeting = true;
			analysis.greetingWord = INFO.greetingWords[j];
			break;
		}
	}
	analysis.more = (analysis.words.length == 1)?false:true;


	
	analysis = addReply(analysis);

	return analysis;
}

function addReply(analysis){
	analysis.ans = "";
	if(analysis.greeting){
		analysis.ans = INFO.greetingWords[Math.floor(Math.random()* INFO.greetingWords.length)] + "....";
		analysis.mood = "happy";
	}

	if(analysis.isQuestion){
		analysis.Q.question = qAbstract(analysis.words, analysis.Q);
		analysis.Q.type = qType(analysis.Q);

		if(analysis.Q.type =="health"){
			analysis.ans += "I'm " + dict.qFine[Math.floor(Math.random() * dict.qFine.length)] + "....";
			if(prev.state != "question"){
				analysis.ans += "How are you? ";
				curr.state = "question";
			}
		}

		if(!analysis.ans){
			analysis.ans += "I don't want to answer your question" + ".....";

			analysis.mood = "angry";
			curr.state = "answer";
		}

	}

	if(prev.rState =="question"){
			analysis.ans += INFO.responses[Math.floor(Math.random() * INFO.responses.length)];
			curr.state = "answer";
		}

	if(analysis.question.toLowerCase().includes("i love you")){
		analysis.ans = "ah, thank you, I don't know what I should say.";
		analysis.mood = "love";
		curr.state = "answer";

	}

	if(!analysis.ans){
		analysis.ans = "I don't have feature to understand " + analysis.question +" yet";
		analysis.mood = "bored";
		curr.state = "answer";
	}

	return analysis;


}

function qAbstract(words, Q){
	var question = "";
	for(var i=0; i < words.length; ++i){
		if(words[i] == Q.qWord){
			while(i < words.length){
				question += words[i]+ " ";
				++i;
			}
		}
	}

	return question.toLowerCase();

}

function qType(Q){
	type = "unknown";
	if(Q.question.includes("you") &&
	  ( Q.question.includes("what's") || Q.question.includes("how are") || Q.question.includes("what is") || Q.question.includes("how're")) ) {
		type = "health"
	}


	return type;


}

/*

*make Q.qWord an array
*each Q.questions should be an array of object which includes a question and type
*some problems with "What is your name" type questions 
*/