// global vars

const preloader = () => {
	setTimeout(() => {
		let preloader = document.querySelector('#preloader');
		preloader.style.opacity = '0';
		setTimeout(() => {
			preloader.style.display = 'none';
		}, 1000)
	}, 1000);
}
document.body.onload = () => preloader();



document.addEventListener('DOMContentLoaded', function() {

	// if (reviewsSlider && window.screen.width < 991) {
	// 	let slider = tns({
	// 	    container: reviewsSlider,
	// 	    items: 1,
	// 		lazyload: true,
	// 		mouseDrag: true,
	// 		speed: 800,
	// 		autoplay: true,
	// 		autoplayTimeout: 2500,
	// 		autoplayButtonOutput: false,
	// 	});
	// }

	console.log('Hello hotReload!');

});
