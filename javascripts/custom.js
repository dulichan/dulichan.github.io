(function($) {
    $.rand = function(arg) {
        if ($.isArray(arg)) {
            return arg[$.rand(arg.length)];
        } else if (typeof arg === "number") {
            return Math.floor(Math.random() * arg);
        } else {
            return 4;  // chosen by fair dice roll
        }
    };
})(jQuery);
$(document).ready(function(){
	var state = "professional"
	var salue = ["Machan", "Adoh", "Mate", "Homey", "Bro", "Dude", "Hello"];
	$("#suprise").click(function(){
		if (state == "professional"){
			$("#salue").html($.rand(salue) + ", I am");
		}
	});
});