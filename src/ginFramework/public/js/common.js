function professional_recommend(obj) {
    var id = $(obj).data('id');
    $.ajax({
        type: "POST",
        url: "/Professional/recommend",
        dataType: "json",
        data: {id : id},
        success: function(res){
            if (res.code === 1) {
                window.location.reload(true);
            } else {
                alert(res.msg);
            }
        }
    });
}

function professional_del(obj) {
    var id = $(obj).data('id');
    $.ajax({
        type: "POST",
        url: "/Professional/delete",
        dataType: "json",
        data: {id : id},
        success: function(res){
            if (res.code === 1) {
                window.location.reload(true);
            } else {
                alert(res.msg);
            }
        }
    });
}

function professional_update_commit(obj) {
    var id = $(obj).data('id');
    var type_id = id > 0 ? $.trim($("[name='type_id']").data('value')) : $.trim($("[name='type_id']").val());
    var content_keyword = $.trim($("[name='content_keyword']").val());
    var content_keyword_expanded = $.trim($("[name='content_keyword_expanded']").val());
    var content_body = $('#edit')[0].childNodes[1].innerHTML;
    var recommend = $('#switch')[0].checked;
    var expansion_on = $('#expansion_switch')[0].checked;
    $.ajax({
        type: "POST",
        url: "/Professional/update",
        dataType: "json",
        data: {
            id: id,
            type_id:type_id,
            content_keyword:content_keyword,
            content_body:content_body,
            recommend:recommend,
            content_keyword_expanded:content_keyword_expanded,
            expansion_on:expansion_on
        },
        success: function(res){
            if (res.code === 1) {
                if (res.data['id']) {
                    window.location.href = "/index.php/Professional/edit?id="+res.data['id'];
                    return true;
                }
                window.location.reload(true);
            } else {
                alert(res.msg);
            }
        }
    });
}

$(function () {
    if ($('[name=searchOpenStatus]').val() == 'open') {
        $('.hideSearchTr').show();
        $('.searchTrHide').show();
        $('.searchTrShow').hide();
        $('.table-put-div').css('height', '62%');
        $('.searchDiv').css('height', '24%');
    }

    $('.searchTrShow').click(function () {
        $('.hideSearchTr').show();
        $('.searchTrHide').show();
        $('.searchTrShow').hide();
        $('[name=searchOpenStatus]').val('open');
        $('.table-put-div').css('height', '62%');
        $('.searchDiv').css('height', '24%');
    });

    $('.searchTrHide').click(function () {
        $('.hideSearchTr').hide();
        $('.searchTrHide').hide();
        $('.searchTrShow').show();
        $('[name=searchOpenStatus]').val('close');
        $('.searchDiv').css('height', '13%');
        $('.table-put-div').css('height', '73%');
    });

    $('.adminDelete').click(function () {
        if (confirm('确认删除该用户?')) {
            $.ajax({
                type: 'POST',
                url: "/Admin/delete",
                data: {id: $(this).data('id')},
                success: function () {
                    window.location.reload();
                }
            })
        }
    });
    var previous;
    $('.robot_select').on('focus', function () {
        previous = this.value;
    }).change(function () {
        let robot_list = JSON.parse($('#robot_list').val());
        if (confirm('是否要切换到' + robot_list[$(this).val()] + '?')){
            let id = $(this).val();
            $.ajax({
                type:"POST",
                url:"/robot/changeRobotId",
                data:{id: id},
                success: function () {
                    if (id == 9) {
                        window.location.href = "/school/user/index";
                    } else {
                        window.location.reload();
                    }
                }
            });
        } else {
            $(this).val(previous);
        }
    });
    $('#profession_keyword_clear').click(function () {
        $('textarea[name=content_keyword]').val("");
    });
    $('#expanded_keyword_clear').click(function () {
        $('textarea[name=content_keyword_expanded]').val("");
    });
    $('#profession_keyword_get').click(function () {
        $.ajax({
            type: "POST",
            url: '/Professional/content_body_keyword_get',
            dataType: "json",
            data: {content : $('#edit')[0].childNodes[1].innerHTML},
            success: function(res){
                if (res.code === 1) {
                    var keywords = res.data;
                    var content = $("[name='content_keyword']").val();
                    $.each(keywords, function(index, value){
                        content = content + ' ' + value;
                    });
                    $("[name='content_keyword']").val(content);
                }
            }
        });
    });
    $('#expand_keyword_get').click(function () {
        $.ajax({
            type: "POST",
            url: '/PublicWord/expandKeywordGet',
            dataType: "json",
            data: {keywords : $("[name='content_keyword']").val()},
            success: function(res){
                if (res.code === 1) {
                    var keywords = res.data;
                    var content = $("[name='content_keyword_expanded']").val();
                    content = content + ' ' + keywords;
                    $("[name='content_keyword_expanded']").val(content);
                }
            }
        });
    });
});
/*-------------- 专业内容页面操作方法 -----------*/
$(function () {
    $('.PsyContent_multi').click(function() {
        var answer = $(this).html();
        $(this).hide();
        $(this).parent().append('<input class="PsyContent_multi_answer_edit" value="' + answer + '">');
    });

    $(document).on('blur', '.PsyContent_multi_answer_edit', function () {
        var id = $(this).parent().children('.PsyContent_multi').data('id');
        var type = $(this).parent().children('.PsyContent_multi').data('type');
        $.ajax({
            type: "POST",
            url: "/index.php/Testing/update",
            dataType: "json",
            data: {id : id, value : $(this).val(), type : type},
            success: function(res) {
                if (res.code === 1) {
                    var edit_obj = $(".PsyContent_multi_answer_edit");
                    edit_obj.parent().children('.PsyContent_multi').html(edit_obj.val()).show();
                    edit_obj.remove();
                } else {
                    alert(res.msg);
                }
            }
        });
    });

    $('.PsyContent_multi_result').click(function() {
        var answer = $(this).html();
        $(this).hide();
        $(this).parent().append('<textarea style="width: 1500px;" class="PsyContent_multi_result_edit">' + answer + '</textarea>');
    });

    $(document).on('blur', '.PsyContent_multi_result_edit', function () {
        var id = $(this).parent().children('.PsyContent_multi_result').data('id');
        $.ajax({
            type: "POST",
            url: "/index.php/Testing/update_result",
            dataType: "json",
            data: {id : id, value : $(this).val(), type : "result"},
            success: function(res) {
                if (res.code === 1) {
                    var edit_obj = $(".PsyContent_multi_result_edit");
                    edit_obj.parent().children('.PsyContent_multi_result').html(edit_obj.val()).show();
                    edit_obj.remove();
                } else {
                    alert(res.msg);
                }
            }
        });
    });
});

/* -------------- 左侧栏 --------------------*/
$(function () {
    $(document).on('click', '.lead_ul_hide', function () {
        $(this).parent().children('ul').stop().css('display','block').hide().slideDown();
        $(this).children('.uiImgDown').css('display','block');
        $(this).children('.uiImgUp').css('display','none');
        $(this).removeClass('lead_ul_hide');
        $(this).addClass('lead_ul_show');
    });
    $(document).on('click', '.lead_ul_show', function () {
        $(this).parent().children('ul').css('display','none').show().slideUp();
        $(this).children('.uiImgDown').css('display','none');
        $(this).children('.uiImgUp').css('display','block');
        $(this).removeClass('lead_ul_show');
        $(this).addClass('lead_ul_hide');
    });
});

/* -------------- 推荐上架与下架 ------------- */
function downShelf(obj) {
    var _this = $(obj);
    var id = parseInt(_this.attr("data-id"));
    var type = parseInt(_this.attr("data-type"));
    var robot_id = parseInt(_this.attr("data-robot"));
    if (id < 1) {return false;}
    if (confirm("是否取消推荐")) {
        $.ajax({
            type: "POST",
            url: "/psychContent/downShelf",
            dataType: "json",
            data: {id : id, type : type, robot_id: robot_id},
            success: function(res){
                if (res.code === 1) {
                    window.location.reload(true);
                } else {
                    alert(res.msg);
                }
            }
        });
    }
}

function upShelf(obj) {
    var _this = $(obj);
    var id = parseInt(_this.attr("data-id"));
    var type = parseInt(_this.attr("data-type"));
    if (id < 1) {return false;}
    if (confirm("是否推荐")) {
        $.ajax({
            type: "POST",
            url: "/psychContent/upShelf",
            dataType: "json",
            data: {id : id, type : type},
            success: function(res){
                if (res.code === 1) {
                    window.location.reload(true);
                } else {
                    alert(res.msg);
                }
            }
        });
    }
}

function TestingShow(obj) {
    var _this = $(obj);
    var id = parseInt(_this.attr("data-id"));
    if (id < 1) {return false;}
    if (confirm("是否显示")) {
        $.ajax({
            type: "POST",
            url: "/testing/updateAttribute",
            dataType: "json",
            data: {id : id, key: "delete_flag", value: 1},
            success: function(res){
                if (res.code === 1) {
                    window.location.reload(true);
                } else {
                    alert(res.msg);
                }
            }
        });
    }
}

function TestingHide(obj) {
    var _this = $(obj);
    var id = parseInt(_this.attr("data-id"));
    if (id < 1) {return false;}
    if (confirm("是否隐藏")) {
        $.ajax({
            type: "POST",
            url: "/testing/updateAttribute",
            dataType: "json",
            data: {id : id, key: "delete_flag", value: 2},
            success: function(res){
                if (res.code === 1) {
                    window.location.reload(true);
                } else {
                    alert(res.msg);
                }
            }
        });
    }
}
/* ------------- 总分题 ----------------- */
$(function () {
    // 测试新增保存按钮点击
    $('.testing_save_button').click(function () {
        let title = $('[name=title]').val();
        let type = $('[name=type]').val();
        let intr = $('[name=des]').val();
        let pic = $('[name=pic_path]').val();
        let label_list = [];
        $('.label_select').each(function () {
            if ($(this).val()) {
                label_list = label_list.concat($(this).val())
            }
        });
        $('[name=label]').val(label_list.join(','));
        var content_keyword = $('[name=content_keyword]').val();
        $.ajax({
            'url': '/testing/add',
            'type': 'POST',
            'data': {'title': title, type: type, intr: intr, pic: pic, label: $('[name=label]').val(), content_keyword: content_keyword, miniprogram_show_name: $("input[name='miniprogram_show_name']").val()},
            'dataType': 'json',
            success: function (res) {
                if (res.code == 1) {
                    window.location.href = '/psychContent/Testing';
                } else {
                    alert(res.msg);
                }
            }
        });
    });
    // 测试编辑保存按钮
    $('.testing_edit_save_button').click(function () {
        let id = $('[name=rid]').val();
        let title = $('[name=title]').val();
        let type = $('[name=type]').val();
        let intr = $('[name=des]').val();
        let pic = $('[name=pic_path]').val();
        let sort = $('[name=sort]').val();
        let unvalidTime = $("[name=unvalidTime]").val();
        let necessary = $("[name=necessary]").prop("checked");
        if (necessary === true) {
            necessary = 1;
        } else {
            necessary = 0;
        }
        let label_list = [];
        $('.label_select').each(function () {
            if ($(this).val()) {
                label_list = label_list.concat($(this).val())
            }
        });
        $('[name=label]').val(label_list.join(','));
        var content_keyword = $('[name=content_keyword]').val();
        $.ajax({
            'url': '/testing/edit',
            'type': 'POST',
            'data': {id: id, 'title': title, type: type, necessary: necessary, intr: intr, pic: pic, label: $('[name=label]').val(), content_keyword: content_keyword, sort: sort, unvalidTime: unvalidTime, miniprogram_show_name: $("input[name='miniprogram_show_name']").val()},
            'dataType': 'json',
            success: function (res) {
                if (res.code == 1) {
                    if (confirm('修改成功, 是否返回上一页?')) {
                        window.location.href = '/psychContent/Testing';
                    } else {
                        window.location.reload();
                    }
                } else {
                    alert(res.msg);
                }
            }
        });
    });
    // 添加封面图点击
    $('#coverAddButton').click(function () {
        $('#cover_pic').click();
    });

    $('#txtLoadButton').click(function () {
        $('#txt_upload').click();
    });
    // 显示答案按钮点击
    $('body').on('click', '.moduleAnswerPathShow', function () {
        $(this).after('<a href="javascript:void(0);" class="moduleAnswerPathHide btn btn-primary">隐藏答案</a>');
        $(this).hide();
        $(this).parent().parent().parent().children().eq(1).show();
    });
    // 显示答案按钮点击
    $('body').on('click', '.moduleAnswerPathHide', function () {
        $(this).after('<a href="javascript:void(0);" class="moduleAnswerPathShow btn btn-primary">显示答案</a>');
        $(this).hide();
        $(this).parent().parent().parent().children().eq(1).hide();
    });
    // 新增按钮点击弹出编辑框
    $('body').on('click', '.questionInfoTrAdd', function () {
        $('[name=questionId]').val(0);
        $('[name=questionDes]').val('');
        $('[name=reverse]').prop("checked", false);
        $("[name=des_question]").prop("checked", false);
        $('.answerListPath').empty();
        $('.masking').fadeIn();
    });
    // 编辑按钮点击弹出问题编辑框  渲染编辑页
    $('body').on('click', '.questionInfoTrUpdate', function () {
        $('[name=questionId]').val($(this).data('id'));
        $('[name=questionDes]').val($(this).data('question'));
        let des_question = $(this).data("des_question");
        let reverse = $(this).data("reverse");
        if (reverse === 1) {
            $('[name=reverse]').prop("checked", true);
        } else {
            $('[name=reverse]').prop("checked", false);
        }
        if (des_question === 1) {
            $("[name=des_question]").prop("checked", true);
        } else {
            $("[name=des_question]").prop("checked", false);
        }
        $('.answerListPath').empty();
        let answerList = $(this).data('answer');
        for (let i in answerList) {
            $('.answerListPath').append(
                '<div style="margin-bottom: 5px" data-id="'+answerList[i]['id']+'">' +
                '<input class="testingAnswerOption" placeholder="option" value="'+answerList[i]['option']+'" style="width: 10%">' +
                '<input class="testingAnswerDes" placeholder="内容" value="'+answerList[i]['answer']+'">' +
                '<input class="testingAnswerScore" placeholder="得分" value="'+answerList[i]['score']+'" style="width: 10%">' +
                '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
                '</div>');
        }
        $('.masking').fadeIn();
    });
    // 编辑页面点击加号添加选项
    $('body').on('click', '.testingAnswerAdd', function () {
        let englishList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
        let index = $('.answerListPath').children().length;
        $('.answerListPath').append(
            '<div style="margin-bottom: 5px" data-id="0">' +
            '<input class="testingAnswerOption" placeholder="option" style="width: 10%" value="'+ englishList[index] +'">' +
            '<input class="testingAnswerDes" placeholder="内容">' +
            '<input class="testingAnswerScore" placeholder="得分" style="width: 10%">' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 编辑页选项删除按钮
    $('body').on('click', '.answeListDelBtn', function () {
        let id = $(this).parent().data('id');
        if (id != 0) {
            $.ajax({
                url: '/testing/multiDeleteById',
                type: 'POST',
                data: {id: id},
                dataType: 'json'
            });
        }
        $(this).parent().remove();
    });
    // 编辑页保存按钮点击
    $('body').on('click', '.testingQuestionSaveButton', function () {
        let rid = $('[name=rid]').val();
        let id = $('[name=questionId]').val();
        let des = $('[name=questionDes]').val();
        let des_question = $("[name=des_question]").prop("checked") === true ? 1 : 0;
        let reverse = $("[name=reverse]").prop("checked") === true ? 1 : 0;
        let answerList = [];
        $('.answerListPath').children().each(function () {
            let data = {};
            data.id = $(this).data('id');
            data.option = $(this).children().eq(0).val();
            data.answer = $(this).children().eq(1).val();
            data.score = $(this).children().eq(2).val();
            answerList.push(data);
        });
        $.ajax({
            url: '/testing/questionEdit',
            type: 'POST',
            data: {rid: rid, id: id, des: des, answerList: answerList, des_question: des_question, reverse: reverse},
            dataType: 'json',
            success: function (res) {
                alert(res.msg);
                if (res.code == 1) {
                    window.location.reload();
                }
            }
        })
    });
    // 编辑页面 删除答案
    $('body').on('click', '.resultInfoTrDelete', function () {
        let id = $(this).data('id');
        $.ajax({
            url: '/testing/resultDeleteById',
            type: 'POST',
            data: {id: id},
            dataType: 'json'
        });
        $(this).parent().parent().remove();
    });
    // 编辑页面 添加答案 (增加添加行, 未执行添加操作)
    $('body').on('click', '.testingResultAdd', function () {
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="resultScoreFrom" placeholder="ScoreFrom" style="width: 6%">' +
            '<input class="resultScoreTo" placeholder="ScoreTo" style="width: 6%">' +
            '<input class="resultDes" placeholder="内容">' +
            '<div class="glyphicon glyphicon-plus btn btn-default testingResultAddDo" style="margin-left: 20px"></div>' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 编辑页面 添加答案 (点击添加 执行添加操作)
    $('body').on('click', '.testingResultAddDo', function () {
        let id = $(this).data('id');
        let rid = $('[name=rid]').val();
        let scoreFrom = $(this).parent().children().eq(0).val();
        let scoreTo = $(this).parent().children().eq(1).val();
        let result = $(this).parent().children().eq(2).val();
        $.ajax({
            url: '/testing/resultAdd',
            type: 'POST',
            data: {id: id, rid: rid, score_from: scoreFrom, score_to: scoreTo, result: result, status: (status === true) ? 1 : 0},
            dataType: 'json',
            success: function (res) {
                if (res.code == 1) {
                    $('.resultInfoTrAdd').remove();
                    $('.resultListPath').append('<div class="resultInfoTr" style="height: 60px; padding: 5px; border-top: 1px solid #ddd">' +
                        '<div class="col-md-1">'+scoreFrom+'</div>' +
                        '<div class="col-md-1">'+scoreTo+'</div>' +
                        '<div class="col-md-7" style="height: 50px; overflow-y: auto">'+result+'</div>' +
                        '<div class="col-md-2">' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="resultInfoTrUpdate btn btn-success">编辑</a>' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="resultInfoTrDelete btn btn-danger">删除</a>' +
                        '</div>' +
                        '</div>');
                } else {
                    alert(res.msg);
                }
            }
        })
    });
    // 编辑页面 编辑答案 (增加编辑框)
    $('body').on('click', '.resultInfoTrUpdate', function () {
        let id = $(this).data('id');
        let scoreFrom = $(this).parent().parent().children().eq(0).text();
        let scoreTo = $(this).parent().parent().children().eq(1).text();
        let result = $(this).parent().parent().children().eq(2).text();
        $(this).parent().parent().remove();
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="resultScoreFrom" placeholder="ScoreFrom" style="width: 6%" value="'+scoreFrom+'">' +
            '<input class="resultScoreTo" placeholder="ScoreTo" style="width: 6%" value="'+scoreTo+'">' +
            '<input class="resultDes" placeholder="内容" value="'+result+'">' +
            '<div class="glyphicon glyphicon-edit btn btn-default testingResultAddDo" data-id="'+id+'" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 答案删除按钮点击
    $('body').on('click', '.productInfoTrDelete', function () {
        let id = $(this).parent().parent().parent().parent().data('id');
        $.ajax({
            url: '/testing/questionDeleteById',
            type: 'POST',
            data: {id: id},
            dataType: 'json'
        });
        $(this).parent().parent().parent().parent().remove();
    });
});

/* ------------- 单选题 ----------------- */
$(function () {
    // 编辑页面 根据ID删除答案
    $('body').on('click', '.singleResultTrDelete', function () {
        let id = $(this).data('id');
        $.ajax({
            url: '/testing/singleDeleteById',
            type: 'POST',
            data: {id: id},
            dataType: 'json'
        });
        $(this).parent().parent().remove();
    });
    // 编辑页面 添加答案 (增加添加行, 未执行添加操作)
    $('body').on('click', '.singleResultAdd', function () {
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="singleResultOption" placeholder="选项" style="width: 10%">' +
            '<input class="singleResultAnswer" placeholder="选项内容" style="width: 30%">' +
            '<input class="singleResultResult" placeholder="返回结果" style="width: 40%">' +
            '<div class="glyphicon glyphicon-plus btn btn-default singleResultAddDo" style="margin-left: 20px"></div>' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 编辑页面 添加答案 (点击添加 执行添加操作)
    $('body').on('click', '.singleResultAddDo', function () {
        let id = $(this).data('id');
        let rid = $('[name=rid]').val();
        let option = $(this).parent().children().eq(0).val();
        let answer = $(this).parent().children().eq(1).val();
        let result = $(this).parent().children().eq(2).val();
        $.ajax({
            url: '/testing/singleResultAdd',
            type: 'POST',
            data: {id: id, rid: rid, option: option, answer: answer, result: result},
            dataType: 'json',
            success: function (res) {
                if (res.code == 1) {
                    $('.resultInfoTrAdd').remove();
                    $('.resultListPath').append('<div class="resultInfoTr" style="height: 60px; padding: 5px; border-top: 1px solid #ddd">' +
                        '<div class="col-md-1">'+option+'</div>' +
                        '<div class="col-md-2">'+answer+'</div>' +
                        '<div class="col-md-7" style="height: 50px; overflow-y: auto">'+result+'</div>' +
                        '<div class="col-md-2">' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="singleResultTrUpdate btn btn-success">编辑</a>' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="resultInfoTrDelete btn btn-danger">删除</a>' +
                        '</div>' +
                        '</div>');
                } else {
                    alert(res.msg);
                }
            }
        })
    });
    // 编辑页面 编辑答案 (增加编辑框)
    $('body').on('click', '.singleResultTrUpdate', function () {
        let id = $(this).data('id');
        let option = $(this).parent().parent().children().eq(0).text();
        let answer = $(this).parent().parent().children().eq(1).text();
        let result = $(this).parent().parent().children().eq(2).text();
        $(this).parent().parent().remove();
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="singleResultOption" placeholder="选项" style="width: 10%" value="'+option+'">' +
            '<input class="singleResultAnswer" placeholder="选项内容" style="width: 30%" value="'+answer+'">' +
            '<input class="singleResultResult" placeholder="返回结果" style="width: 40%" value="'+result+'">' +
            '<div class="glyphicon glyphicon-edit btn btn-default singleResultAddDo" data-id="'+id+'" style="margin-left: 20px"></div>' +
            '</div>');
    });
});

/* ------------- 跳转题 ----------------- */
$(function () {
    // 编辑页 编辑按钮()
    $('body').on('click', '.jumpResultTrUpdate', function () {
        let id = $(this).data('id');
        let result = $(this).parent().parent().children().eq(0).text();
        $(this).parent().parent().remove();
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="resultDes" placeholder="内容" value="'+result+'" style="width: 70%">' +
            '<div class="glyphicon glyphicon-edit btn btn-default jumpResultAddDo" data-id="'+id+'" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 编辑页 添加答案(增加答案行) 点击
    $('.jumpResultAdd').click(function () {
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="resultDes" placeholder="内容">' +
            '<div class="glyphicon glyphicon-plus btn btn-default jumpResultAddDo" style="margin-left: 20px"></div>' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 编辑页 添加/编辑答案(执行)
    $('body').on('click', '.jumpResultAddDo', function () {
        let id = $(this).data('id');
        let rid = $('[name=rid]').val();
        let result = $(this).parent().children().eq(0).val();
        $.ajax({
            url: '/testing/resultAdd',
            type: 'POST',
            data: {id: id, rid: rid, result: result},
            dataType: 'json',
            success: function (res) {
                if (res.code == 1) {
                    $('.resultInfoTrAdd').remove();
                    $('.resultListPath').append('<div class="resultInfoTr" style="height: 60px; padding: 5px; border-top: 1px solid #ddd">' +
                        '<div class="col-md-8" style="height: 50px; overflow-y: auto">'+result+'</div>' +
                        '<div class="col-md-2">' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="jumpResultTrUpdate btn btn-success">编辑</a>' +
                        '   <a href="javascript:void(0);" data-id="'+res.data.id+'" class="resultInfoTrDelete btn btn-danger">删除</a>' +
                        '</div>' +
                        '</div>');
                } else {
                    alert(res.msg);
                }
            }
        })
    });
    // 跳转题点击编辑 跳出弹窗
    $('body').on('click', '.jumpQuestionTrUpdate', function () {
        $('[name=questionId]').val($(this).data('id'));
        $('[name=questionDes]').val($(this).data('question'));
        $('.answerListPath').empty();
        let answerList = $(this).data('answer');
        for (let i in answerList) {
            $('.answerListPath').append(
                '<div style="margin-bottom: 5px" data-id="'+answerList[i]['id']+'">' +
                '<input class="testingAnswerOption" placeholder="option" value="'+answerList[i]['option']+'" style="width: 10%">' +
                '<input class="testingAnswerDes" placeholder="内容" value="'+answerList[i]['answer']+'">' +
                ' 下一题: <span class="nextQuestionText">'+answerList[i]['next_info']+'</span>' +
                '<input type="hidden" class="nextQuestionType" value="'+JSON.parse(answerList[i]['next_id'])['type']+'">' +
                '<input type="hidden" class="nextQuestionId" value="'+JSON.parse(answerList[i]['next_id'])['id']+'">' +
                '<div class="glyphicon glyphicon-edit answerNextQuestionSelect btn btn-default" style="margin-left: 20px"></div>' +
                '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
                '</div>');
        }
        $('.masking').fadeIn();
    });
    // 跳转题 编辑弹窗内 点击添加答案按钮
    $('body').on('click', '.jumpAnswerAdd', function () {
        $('.answerListPath').append(
            '<div style="margin-bottom: 5px" data-id="0">' +
            '<input class="testingAnswerOption" placeholder="option" style="width: 10%">' +
            '<input class="testingAnswerDes" placeholder="内容">' +
            ' 下一题: <span class="nextQuestionText">未选择</span>' +
            '<input type="hidden" class="nextQuestionType">' +
            '<input type="hidden" class="nextQuestionId">' +
            '<div class="glyphicon glyphicon-edit answerNextQuestionSelect btn btn-default" style="margin-left: 20px"></div>' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 跳转题 下一题选择
    $('body').on('click', '.answerNextQuestionSelect', function () {
        let rid = $('[name=rid]').val();
        let questionId = $('[name=questionId]').val();
        $(this).parent().find('.nextQuestionText').addClass('selectAnswer');
        $(this).parent().find('.nextQuestionType').addClass('selectAnswerType');
        $(this).parent().find('.nextQuestionId').addClass('selectAnswerId');
        $.ajax({
            type: 'post',
            url: '/testing/getJumpQuestionLink',
            data: {rid: rid, questionId: questionId},
            dataType: 'json',
            success:function (data) {
                let str = '';
                for (let x in data.data['questionList']) {
                    str = str + '<tr>' +
                        '<td class="col-md-1">'+data.data['questionList'][x]['des']+'</td>' +
                        '<td class="col-md-4"></td>' +
                        '<td><input type="button" class="btn btn-xs btn-primary jumpQuestionSelect" data-des="'+data.data['questionList'][x]['des']+'" data-type="1" data-id="'+data.data['questionList'][x]['id']+'" value="选择"></td>' +
                        '</tr>';
                };
                $('.tool_path').empty().append(
                    '<span class="help-block" style="margin-left: 20px">跳转题目:</span>' +
                    '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
                    '</table>'
                );
                let resStr = '';
                for (let x in data.data['resultList']) {
                    resStr = resStr + '<tr>' +
                        '<td class="col-md-1">'+data.data['resultList'][x]['result']+'</td>' +
                        '<td class="col-md-4"></td>' +
                        '<td><input type="button" class="btn btn-xs btn-primary jumpQuestionSelect" data-des="'+data.data['resultList'][x]['result']+'" data-type="2" data-id="'+data.data['resultList'][x]['id']+'" value="选择"></td>' +
                        '</tr>';
                };
                $('.tool_path').append(
                    '<span class="help-block" style="margin-left: 20px">跳转答案:</span>' +
                    '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + resStr +
                    '</table>'
                );
                $('.tool_layer').fadeIn();
            }
        });
    });
    // 跳转题 下一题选择完成
    $('body').on('click', '.jumpQuestionSelect', function () {
        let type = $(this).data('type');
        let id = $(this).data('id');
        let des = $(this).data('des');
        $('.selectAnswer').empty().append(des);
        $('.selectAnswer').removeClass('selectAnswer');
        $('.selectAnswerType').val(type);
        $('.selectAnswerType').removeClass('selectAnswerType');
        $('.selectAnswerId').val(id);
        $('.selectAnswerId').removeClass('selectAnswerId');
        $('.tool_layer').hide();
    });
    // 跳转题 编辑弹窗保存点击, 关闭弹窗
    $('body').on('click', '.jumpQuestionSaveButton', function () {
        let rid = $('[name=rid]').val();
        let id = $('[name=questionId]').val();
        let des = $('[name=questionDes]').val();
        let answerList = [];
        $('.answerListPath').children().each(function () {
            let type;
            let id;
            if ($(this).find('.nextQuestionType').val() != "undefined") {
                type = $(this).find('.nextQuestionType').val();
            } else {
                type = 0;
            }
            if ($(this).find('.nextQuestionId').val() != "undefined") {
                id = $(this).find('.nextQuestionId').val();
            } else {
                id = 0;
            }
            let data = {};
            data.id = $(this).data('id');
            data.option = $(this).children().eq(0).val();
            data.answer = $(this).children().eq(1).val();
            data.next_id = {type:type, id: id};
            answerList.push(data);
        });
        $.ajax({
            url: '/testing/jumpQuestionEdit',
            type: 'POST',
            data: {rid: rid, id: id, des: des, answerList: answerList},
            dataType: 'json',
            success: function (res) {
                alert(res.msg);
                if (res.code == 1) {
                    window.location.reload();
                }
            }
        })
    });
});

/* ------------- 维度题 ----------------- */
$(function () {
    // 编辑页面 添加答案 (增加添加行, 未执行添加操作)
    $('.dimensionResultAdd').click(function () {
        let dimension = $('[name=dimension]').val();
        dimension = dimension.split(',');
        let str = '<option value="总体">总体</option>';
        for (let i in dimension) {
            str = str + '<option value="'+dimension[i]+'">'+dimension[i]+'</option>'
        }
        $('.resultListPath').append('<div class="resultInfoTrAdd" style="margin-bottom: 5px" data-id="0">' +
            '<input class="resultScoreFrom" placeholder="ScoreFrom" style="width: 8%">' +
            '<input class="resultScoreTo" placeholder="ScoreTo" style="width: 8%">' +
            '<select class="resultType" style="width: 10%"><option>个人均分</option><option>群体均分</option><option>百分等级</option></select>' +
            '<input class="resultDes" placeholder="内容" style="width: 45%;">' +
            '<select class="resultDimension" style="width: 10%">'+str+'</select>' +
            '<div class="glyphicon glyphicon-plus btn btn-default dimensionResultAddDo" style="margin-left: 20px"></div>' +
            '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
            '</div>');
    });
    // 维度题新增按钮点击 编辑器弹窗显示
    $('.dimensionQuestionTrAdd').click(function () {
        $('[name=questionId]').val(0);
        $('[name=questionDes]').val('');
        $('.answerListPath').empty();
        $('[name=des_question]').prop("checked", false);
        $('[name=reverse]').prop("checked", false);
        $('.masking').fadeIn();
    });
    // 维度题 保存
    $('.dimensionQuestionSaveButton').click(function () {
        let rid = $('[name=rid]').val();
        let id = $('[name=questionId]').val();
        let des = $('[name=questionDes]').val();
        let dimension = $('.questionDimensionSelect').val();
        let des_question = $("[name=des_question]").prop("checked") === true ? 1 : 0;
        let reverse = $("[name=reverse]").prop("checked") === true ? 1 : 0;
        let answerList = [];
        $('.answerListPath').children().each(function () {
            let data = {};
            data.id = $(this).data('id');
            data.option = $(this).children().eq(0).val();
            data.answer = $(this).children().eq(1).val();
            data.score = $(this).children().eq(2).val();
            answerList.push(data);
        });
        $.ajax({
            url: '/testing/questionEdit',
            type: 'POST',
            data: {rid: rid, id: id, des: des, answerList: answerList, dimension: dimension, des_question: des_question, reverse: reverse},
            dataType: 'json',
            success: function (res) {
                alert(res.msg);
                if (res.code == 1) {
                    window.location.reload();
                }
            }
        })
    });
    // 点击复制, 复制所选题目与选项;
    $(".btn-copy").click(function () {
        $.ajax({
            type: "POST",
            url: "/testing/copy_multi",
            dataType: "json",
            data: {rid: $("input[name=rid]").val(), mid: $(this).data('id')},
            success: function(res){
                if (res.code === 1) {
                    window.location.reload();
                }
            }
        });
    });
    // 编辑按钮点击 弹出编辑框
    $('body').on('click', '.dimensionQuestionTrUpdate', function () {
        let answerListPath = $('.answerListPath');
        $('[name=questionId]').val($(this).data('id'));
        $('[name=questionDes]').val($(this).data('question'));
        let des_question = $(this).data("des_question");
        let reverse = $(this).data("reverse");
        if (reverse === 1) {
            $('[name=reverse]').prop("checked", true);
        } else {
            $('[name=reverse]').prop("checked", false);
        }

        if (des_question === 1) {
            $("[name=des_question]").prop("checked", true);
            $(".questionDimensionSelect").attr("disabled", true);
        } else {
            $("[name=des_question]").prop("checked", false);
            $(".questionDimensionSelect").attr("disabled", false).val($(this).data('dimension'));
        }
        let answerList = $(this).data('answer');
        answerListPath.empty();
        for (let i in answerList) {
            answerListPath.append(
                '<div style="margin-bottom: 5px" data-id="'+answerList[i]['id']+'">' +
                '<input class="testingAnswerOption" placeholder="option" value="'+answerList[i]['option']+'" style="width: 10%">' +
                '<input class="testingAnswerDes" placeholder="内容" value="'+answerList[i]['answer']+'">' +
                '<input class="testingAnswerScore" placeholder="得分" value="'+answerList[i]['score']+'" style="width: 10%">' +
                '<div class="glyphicon glyphicon-minus answeListDelBtn btn btn-default" style="margin-left: 20px"></div>' +
                '</div>');
        }
        $('.masking').fadeIn();
    });
    /**
     * 维度题答案部分处理
     */
    // 答案维度选择 修改所有编辑框
    $('[name=result_dimension]').change(function () {
        $.ajax({
            url: '/testing/getResultByDimension',
            type: 'POST',
            data: {dimension: $(this).val(), rid: $('[name=rid]').val()},
            dataType: 'json',
            success: function (res) {
                $('[name=result_part_1],[name=result_part_2],[name=result_part_3], [name=result_part_4], [name=result_part_5]').val('');
                $('[name=result_part_1],[name=result_part_2],[name=result_part_3], [name=result_part_4], [name=result_part_5]').data('id', 0);
                $.each(res, function (i , e) {
                    $('[name=result_part_'+ e.dimension_res_state +']').val(e.result);
                    if (e.id) {
                        $('[name=result_part_'+ e.dimension_res_state +']').data('id', e.id);
                    } else {
                        $('[name=result_part_'+ e.dimension_res_state +']').data('id', 0);
                    }
                });
            }
        })
    });
    // 答案 取消聚焦时 保存答案
    $('[name=result_part_1],[name=result_part_2],[name=result_part_3], [name=result_part_4], [name=result_part_5]').blur(function () {
        let result = $(this).val();
        let dimension = $('[name=result_dimension]').val();
        if (dimension === '') {
            return 0;
        }
        let obj = $(this);
        $.ajax({
            url: '/testing/resultAdd',
            type: 'POST',
            data: {id: $(this).data('id'), result: result, rid: $('[name=rid]').val(), dimension: dimension, dimension_res_state: $(this).data('state')},
            dataType: 'json',
            success: function (res) {
                if (res.code != 1) {
                    alert('修改失败');
                }
                obj.data('id', res.data['id']);
                if (obj.parent().parent().children().eq(2).children('input').length === 1) {
                    obj.parent().parent().children().eq(2).children('input').data('id', res.data['id']);
                }
                obj.css('border', '1px solid lightgreen')
            }
        })
    });
    // 雷达图上方,下方文字,折线图上方文字保存
    $('[name=radar_up_text],[name=radar_down_text],[name=line_up_text]').blur(function () {
        let result = $(this).val();
        let obj = $(this);
        $.ajax({
            url: '/testing/resultAdd',
            type: 'POST',
            data: {id: $(this).data('id'), result: result, rid: $('[name=rid]').val(), dimension_res_state: $(this).data('state')},
            dataType: 'json',
            success: function (res) {
                if (res.code != 1) {
                    alert('修改失败');
                }
                obj.data('id', res.data['id']);
                obj.css('border', '1px solid lightgreen')
            }
        })
    });
    // 聚焦答案编辑框时, 边框变色提示
    $('[name=result_part_1],[name=result_part_2],[name=result_part_3], [name=result_part_4], [name=result_part_5], [name=result_text],[name=radar_up_text],[name=radar_down_text],[name=line_up_text]').focus(function () {
        $(this).css('border', '1px solid black')
    });
    // 维度题 sort修改取消聚焦时保存
    $('.question_index').blur(function () {
        let sort = $(this).val();
        let id = $(this).data('id');
        let obj = $(this);
        let data = [];
        data.push({sort: sort, id:id});
        $.ajax({
            url: '/testing/sortUpdate',
            type: 'POST',
            data: {data: data},
            dataType: 'json',
            success: function (res) {
                if (res.code != 1) {
                    alert('修改失败');
                }
                obj.data('id', res.data['id']);
                obj.css('border', '1px solid lightgreen')
            }
        });
    });
    // 维度题打乱顺序
    $('.upsetSort').click(function () {
        $.ajax({
            url: '/testing/sortUpdate',
            type: 'POST',
            data: {rid: $('[name=rid]').val()},
            dataType: 'json',
            success: function (res) {
                if (res.code == 1) {
                    window.location.reload();
                } else {
                    alert('打乱失败');
                }
            }
        })
    });
});
// 测试删除按钮;
function Testingdel(obj) {
    let _this = $(obj);
    let id = parseInt(_this.attr("data-id"));
    if (confirm('是否删除?')) {
        $.ajax({
            'url': '/testing/delete',
            'type': 'POST',
            'data':{id:id},
            'dataType' : 'json',
            success:function (res) {
                if (res.code == 1) {
                    window.location.reload();
                } else {
                    alert(res.msg);
                }
            }
        })
    }
}
// 图片上传方法
function picUpload() {
    $.ajax({
        url:"/picUpload",
        type: 'POST',
        cache: false,
        data: new FormData($('.cover_upload')[0]),
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data) {
            if (data.code === 0) {
                alert(data.msg);
            } else {
                $('[name=pic_path]').val(data.data);
                $("#coverShowPath").empty().append('<img src="http://resource.soulbuddy.cn/public/uploads/testing/'+ data.data +'" style="width: 50px;height: 50px;">');
            }
        }
    });
}

function txtUpload() {
    $.ajax({
        url:"/extend/multiUpload",
        type: 'POST',
        cache: false,
        data: new FormData($('.txt_upload')[0]),
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data) {
            if (data.code === 0) {
                alert(data.msg);
            } else {
                window.location.reload();
            }
        }
    });
}