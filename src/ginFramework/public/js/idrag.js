// JavaScript Document
$(function(){
	$(".m_title").bind('mouseover',function(){
		$(this).css("cursor","move")
	});
	var $list = $("#module_list");
	
	$list.sortable({
		opacity: 0.6,
		revert: true,
		cursor: 'move',
		handle: '.m_title',
		update: function () {
			let type = $('#module_list').data('type');
			if (type == 'professional') {
				let preview = $('.questionAnswerPath').children();
				let choosen = $('.answerListPath').children();
				let preview_input = '';
				$(choosen).each(function (i, e) {
					$(preview).each(function (k, v) {
						if (choosen.eq(i).find('.answerDes').val() == preview.eq(k).find('.previewChoice').text()) {
							preview_input += '<div>' + preview.eq(k).html() + '</div>';
						}
					});
				});
				$('.questionAnswerPath').empty().append(preview_input);
			} else {
				let parts = $('#module_list').find('.modules');
				let data = [];
				parts.each(function (i, e) {
					data.push({sort: i + 1, id: $(this).data('id')});
				});
				console.log(data);
				$.ajax({
					url: '/testing/sortUpdate',
					type: 'POST',
					data: {data},
					dataType: 'json',
					success: function () {
					}
				});
			}
        }
	});
});