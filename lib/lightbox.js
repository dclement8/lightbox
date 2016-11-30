var f = (function() {
	return {
		modules : {}
	}
}) ();

f.modules.modal = (function() {
	// Private
	var img;
	// Public
	return {
		init : function() {
			$('.vignette').click(f.modules.modal.show);
			$('#modal #modal_close').click(f.modules.modal.show);
			$('#modal #modal_prec').click(f.modules.modal.prec);
			$('#modal #modal_suiv').click(f.modules.modal.suiv);
			$('#modal #modal_large').click(f.modules.modal.large);
			// Keyboard shortcuts
			$(document).keydown(function(e) {
				// Detection if input or textarea are focused
				if(!($("input").is(":focus")) && !($("textarea").is(":focus"))) {
					if(e.keyCode === true)
						var key = e.keyCode;
					else
						var key = e.which;

					if(key === 37)
						f.modules.modal.prec();
					else if(key === 39)
						f.modules.modal.suiv();
					else if(key === 27) // esc
						f.modules.modal.show();
				}
			});
		},

		show : function() {
			if($(this).find('img').length > 0) {
				// If there is a child element img not empty in "this"
				// In the case of a click on close button => go to else
				// For previous and next buttons it depends if previous/next element (that we'll bind) exists or not

				// Open the lightbox
				img = $(this); // We keep the element in a variable to use it later
				f.modules.modal.setImage($(img.find('img')[0]).attr('data-img'));
				f.modules.modal.setTexte($(img.find('div')[0]).html());
				$('#comment_show').html(f.modules.storage.get);
				$('#modal').fadeIn("slow");
			}
			else {
				// Close the lightbox
				img = '';
				$('#modal').fadeOut("slow");
			}
		},

		prec : function() {
			f.modules.modal.show.bind(img.prev())(); // we add "()" for executing show function
		},

		suiv : function() {
			f.modules.modal.show.bind(img.next())();
		},

		large : function() {
			if($('#modal_content').is('.large')) {
				// passage to normal
				$('#comment_btn').hide();
				$('#comment').show();
			}
			else {
				// passage to large
				$('#comment_btn').show();
			}
			$('#modal_content').toggleClass('large');
			$('#modal_content').toggleClass('normal');
			$('#comment').toggleClass('large');
			$('#comment').toggleClass('normal');
		},

		setImage : function(img) {
			$('#modal #modal_img').attr('src', img);
		},

		setTexte : function(txt) {
			$('#modal #modal_txt').html(txt);
		},

		getImg : function() {
			if($(img).find('img').length == 0) {
				return false;
			}
			else {
				return $(img.find('img')[0]).attr('data-img');
			}
		}
	}
}) ();

f.modules.comment = (function () {
	return {
		init : function() {
			$('#comment_btn').click(f.modules.comment.toggle);
			$('#comment_submit').click(f.modules.comment.poster);
			$('#comment_reset').click(f.modules.comment.reset);
		},

		toggle : function() {
			$('#comment').toggle();
		},

		reset : function() {
			$('#comment_name').val("");
			$('#comment_value').val("");
		},

		poster : function() {
			var img = f.modules.modal.getImg();
			console.log(img);
			if(!storageAvailable('localStorage')) {
				alert('Unfortunately, localStorage is not available, you can\'t save comments .');
			}
			else if($('#comment_name').val().length === 0 || $('#comment_value').val().length === 0) {
				alert('Please fill in all fields!');
			}
			else if(img !== false) {
				f.modules.storage.add($('#comment_name').val(), $('#comment_value').val(), img);
				$('#comment_show').html(f.modules.storage.get);
			}
		}
	}
}) ();

f.modules.storage = (function () {
	return {
		add : function(name, val, img) {
			var lightbox = '';
			val = val.replace(/\n/g, "<br />"); // line break management
			var commentaire = new Array(name, val);
			console.log(localStorage.getItem('lightbox'));
			if(localStorage.getItem('lightbox')) {
				lightbox = localStorage.getItem('lightbox');
				lightbox = JSON.parse(lightbox);

				if(!lightbox[img]) {
					lightbox[img] = [];
				}
			}
			else {
				lightbox = {
					[img] : []
				};
			}

			lightbox[img].push({"name":name, "value":val});
			localStorage.setItem('lightbox', JSON.stringify(lightbox));
		},

		get : function(id) {
			var html = '';
			if(storageAvailable('localStorage')) {
				if(localStorage.getItem('lightbox')) {
					var img = f.modules.modal.getImg();
					var lightbox = localStorage.getItem('lightbox');
					lightbox = JSON.parse(lightbox);
					if(lightbox[img]) {
						for(var i = lightbox[img].length-1; i >= 0; i--) {
							html += '<p><strong>'+lightbox[img][i]["name"]+' :</strong> '+lightbox[img][i]["value"]+'</p><hr>';
						}
					}
				}
			}
			return html;
		}
	}
}) ();

// Init on page loading
$(document).ready(function() {
	f.modules.modal.init();
	f.modules.comment.init();
});

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
