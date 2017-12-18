var target_date = new Date('May 03, 2017 18:00:00').getTime();

// variables for time units
var days, hours, minutes, seconds;

// get tag element
var countdown = document.getElementById('countdown');

// update the tag with id "countdown" every 1 second
setInterval(showCounter , 1000);

function showCounter() {

	// find the amount of "seconds" between now and target
	var current_date = new Date().getTime();
	var seconds_left = (target_date - current_date) / 1000;

	// do some time calculations
	days = parseInt(seconds_left / 86400);
	seconds_left = seconds_left % 86400;

	hours = parseInt(seconds_left / 3600);
	seconds_left = seconds_left % 3600;

	minutes = parseInt(seconds_left / 60);
	seconds = parseInt(seconds_left % 60);

	// format countdown string + set tag value
	document.getElementById('countdown').innerHTML = '<h4><span class="days">'
		+ days
		+ ' <b><small>Days</small></b></span> <span class="hours">'
		+ hours
		+ ' <b><small>Hours</small></b></span>'
		+ '<span class="minutes"> '
		+ minutes
		+ ' <b><small>Minutes</small></b></span> <span class="seconds">'
		+ seconds
		+ ' <b><small>Seconds</small></b></span></h4>';

}
