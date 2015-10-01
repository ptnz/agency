/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/


$(document).ready(function() {
	/* Slider */
	$('.carousel').carousel({
		pause: 'hover',//Pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on mouseleave
		interval: 5000
	});
	/* /Slider */

	/* Isotope */
	// init Isotope
	var $grid = $('.grid').isotope({
		itemSelector: '.isotope-item',
		layoutMode: 'fitRows'
	});
	// filter functions
	//var filterFns = {
	//	// show if number is greater than 50
	//	numberGreaterThan50: function() {
	//		var number = $(this).find('.number').text();
	//		return parseInt( number, 10 ) > 50;
	//	},
	//	// show if name ends with -ium
	//	ium: function() {
	//		var name = $(this).find('.name').text();
	//		return name.match( /ium$/ );
	//	}
	//};
	// bind filter button click
	$('.isotope-navigation').on( 'click', 'a', function() {
		var filterValue = $( this ).attr('data-filter');
		// use filterFn if matches value
		//filterValue = filterFns[ filterValue ] || filterValue;
		$grid.isotope({ filter: filterValue });
	});
	// change is-checked class on buttons
	$('.button-group').each( function( i, buttonGroup ) {
		var $buttonGroup = $( buttonGroup );
		$buttonGroup.on( 'click', 'a', function() {
			$buttonGroup.find('.is-checked').removeClass('is-checked');
			$( this ).addClass('is-checked');
		});
	});
	/* /Isotope */

});