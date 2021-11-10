$(function () {
    // 编辑页显示答案
    $('body').on('click', '.showAnswer', function () {
        let id = $(this).data('id');
        $('.answer'+ id).show();
        $(this).after('<input type="button" class="btn btn-xs btn-primary closeAnswer" data-id="'+ id +'" value="关闭显示">');
        $(this).remove();
    });
    // 编辑页显示推荐范围
    $('body').on('click', '.showRecommend', function () {
        let id = $(this).data('id');
        $('.answer'+ id).css('display', 'block');
        $(this).after('<input type="button" class="btn btn-xs btn-primary closeRecommend" data-id="'+ id +'" value="关闭显示">');
        $(this).remove();
    });
    // 编辑页关闭答案显示
    $('body').on('click', '.closeAnswer', function () {
        let id = $(this).data('id');
        $('.answer'+ id).css('display', 'none');
        $(this).after('<input type="button" class="btn btn-xs btn-primary showAnswer" data-id="'+ id +'" value="跳转选项">');
        $(this).remove();
    });
    // 编辑页关闭推荐显示
    $('body').on('click', '.closeRecommend', function () {
        let id = $(this).data('id');
        $('.answer'+ id).css('display', 'none');
        $(this).after('<input type="button" class="btn btn-xs btn-primary showRecommend" data-id="'+ id +'" value="推荐范围">');
        $(this).remove();
    });
    // 编辑页删除问题按钮
    $('body').on('click', '.questionDeleteButton', function () {
        if (confirm('是否删除?')) {
            let btn = $(this);
            let id = $(this).data('id');
            $.ajax({
                url: '/multi/deleteMultiById',
                type: 'POST',
                data: {id: id},
                dataType: 'json',
                success: function () {
                    btn.parent().parent().parent().parent().remove();
                }
            })
        }
    });
    // 问题编辑按钮点击 弹出弹出框
    $('body').on('click', '.questionEditButton', function () {
        let type = $(this).data('type');
        $('[name=questionType]').val(type);
        let des = $(this).data('des');
        let rid = $('[name=rid]').val();
        let reset_attribute = $(this).data("reset_attribute");

        if (reset_attribute) {
            $("[name=reset_attribute]").prop("checked", true);
        } else {
            $("[name=reset_attribute]").prop("checked", false);
        }


        // 预览区的清空
        $('.questionShowPath').empty();
        $('.questionShowPath').append(des);
        $('.answerListPath').empty();
        $('.RecommendRangeShowPath').empty();

        // 左侧的根据类型的隐藏与显示
        $('.link-tool-box').show();
        $('.link-rand-box').hide();
        $('.singleChoice').hide();
        $('.FreeInput').hide();
        $('.RecommendInput').hide();
        $('.questionAnswerPath').empty();
        $('.nextQuestionShowPath').empty();
        $('.randEndShowPath').empty();
        $('[name=ai_match]').prop('checked', false);
        if (des) {
            UE.getEditor('container').ready(function () {
                ue.setContent(des);
            });
        }
        let id = $(this).data('id');
        $('[name=questionId]').val(id);
        if (type == 1) {
            let user_attribute = $(this).data('user_attribute_key');
            $('[name=single_user_attribute]').val(user_attribute);
            $('.singleChoice').show();
            let answerList = $(this).data('answer');
            for (let i = 0; i < answerList.length; i++) {
                $('.answerListPath').append('' +
                    '<div class="modules" style="margin-bottom: 5px">' +
                    '<div class="m_title">' +
                    '<input class="answerDes blurChangePreview" value="'+ answerList[i]['answer'] +'">' +
                    '<input class="answerSort sortChangePreview" name="sort" value="'+ answerList[i]['sort'] +'">' +
                    '<a class="glyphicon glyphicon-ban-circle answerDesDelete" style="cursor: pointer;color: #000000; text-decoration: none;"></a>' +
                    '</div>' +
                    '</div>');
                let next_info = JSON.parse(answerList[i]['next_id']);
                let answer_type = next_info.type;
                let id = next_info.id;
                if (answer_type == 4) {
                    $.ajaxSettings.async = false;
                    $.ajax({
                        url: '/multi/getModelQuestionInfoById',
                        type: 'POST',
                        data: {id: id, rid: answerList[i]['rid']},
                        dataType: 'json',
                        success: function (res) {
                            let outQuestionId = '未设置';
                            let outQuestionDes = '未设置';
                            if (res.data.outQuestionInfo) {
                                outQuestionId = res.data.outQuestionInfo['id'];
                                outQuestionDes = res.data.outQuestionInfo['des'];
                            }
                            $('.questionAnswerPath').append(
                                '<div>' +
                                '<input type="radio" data-type="'+ answer_type +'" data-id="'+ id +'" data-selfId="'+ answerList[i]['id'] +'" ' +
                                'data-title="'+ res.data.resolutionInfo['title'] +'" data-outQuestionId="'+ outQuestionId +'" ' +
                                'data-outQuestionDes="'+ outQuestionDes +'" name="previewAnswerRadio"> ' +
                                '<span class="previewChoice">'+ answerList[i]['answer'] +'</span>' +
                                '</div>'
                            );
                        }
                    });
                } else if (answer_type == 6) {
                    $('.questionAnswerPath').append(
                        '<div>' +
                        '<input type="radio" data-type="'+ answer_type +'" data-href="'+ next_info.href +'" data-selfId="'+ answerList[i]['id'] +'" name="previewAnswerRadio"> ' +
                        '<span class="previewChoice">'+ answerList[i]['answer'] +
                        '</div>'
                    );
                } else {
                    $('.questionAnswerPath').append(
                        '<div>' +
                        '<input type="radio" data-type="'+ answer_type +'" data-id="'+ id +'" data-selfId="'+ answerList[i]['id'] +'" data-sort="'+ answerList[i]['sort'] +'" name="previewAnswerRadio"> ' +
                        '<span class="previewChoice">'+ answerList[i]['answer'] +'</span>'+
                        '</div>'
                    );
                }
            }
        } else if (type == 4 || type == 5 || type == 3) {
            if (type == 4) {
                $('.FreeInput').fadeIn();
                let user_attribute = $(this).data('user_attribute_key');
                $('[name=free_input_user_attribute]').val(user_attribute);
                if ($(this).data('aimatch') == 1) {
                    $('[name=ai_match]').prop('checked', true);
                }
            }
            if (type == 3) {
                $('.RecommendInput').fadeIn();
                let answerList = $(this).data('answer');
                for (let i = 0; i < answerList.length; i++) {
                    let recommendInfo = JSON.parse(answerList[i]['answer']);
                    $.ajax({
                        url: '/recommend/getRecommendInfoById',
                        type: 'POST',
                        data: {id: recommendInfo['content_id'], type: recommendInfo['type_id']},
                        dataType: 'json',
                        success: function (res) {
                            let type;
                            if (res.data.type == 8) {
                                type = '文章';
                            } else if (res.data.type == 6) {
                                type = '音乐';
                            } else if (res.data.type == 9) {
                                type = '视频';
                            } else {
                                type = '测试';
                            }
                            if (res.data.RecommendInfo) {
                                $('.RecommendRangeShowPath').append(
                                    '<tr style="height: 30px">' +
                                    '   <td>'+ res.data.RecommendInfo.title +'</td>' +
                                    '   <td>'+ type +'</td>' +
                                    '   <td><input type="button" class="btn btn-xs btn-danger RecommendRemoveButton" data-selfid="'+answerList[i]['id']+'" data-id="'+res.data.id+'" data-type="'+res.data.type+'" value="删除"></td>' +
                                    '</tr>'
                                );
                            }
                        }
                    })
                }
            }
            let next_info = $(this).data('next');
            let id = next_info['id'];
            let next_type = next_info['type'];
            if (next_type == 4) {
                $.ajax({
                    url: '/multi/getModelQuestionInfoById',
                    type: 'POST',
                    data: {id: id, rid: $(this).data('rid')},
                    dataType: 'json',
                    success: function (res) {
                        let outQuestionId = '未设置';
                        let outQuestionDes = '未设置';
                        if (res.data.outQuestionInfo) {
                            outQuestionId = res.data.outQuestionInfo['id'];
                            outQuestionDes = res.data.outQuestionInfo['des'];
                        }
                        $('.nextQuestionShowPath').empty().append('<input type="hidden" name="nextQuestionInfo" data-id="'+ id +'" data-type="4">' +
                            '<p>'+ res.data.resolutionInfo['title'] +'</p>' +
                            '<input class="btn btn-xs btn-info" name="modelQuestionExitChooseBtn" value="选择出口">' +
                            '<div class="outQuestionPath"><input type="hidden" name="modelOutQuestion" data-id="'+ outQuestionId +'">' +
                            '<p>'+ outQuestionDes +'</p></div>'
                        );
                    }
                });
            } else {
                if (!id) {
                    $('.nextQuestionShowPath').append('<span class="help-block">点击工具栏编辑</span>');
                } else if (next_type == 2) {
                    $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="4000" data-type="2"><span class="help-block">结束</span>');
                } else if (next_type == 3) {
                    $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="4000" data-type="3"><span class="help-block">结束</span>');
                } else {
                    $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="' + id + '" data-type="' + next_type + '">');
                    $.ajax({
                        url: '/multi/getMultiInfoById',
                        type: 'POST',
                        data: {id: id, type: next_type},
                        dataType: 'json',
                        success: function (res) {
                            let showPathHtml = '';
                            if (res.data.multiInfo != null) {
                                for (let i = 0; i < res.data.multiAnswer.length; i++) {
                                    showPathHtml = showPathHtml + '<p><input type="radio" name="nextPreviewRadio"> ' + res.data.multiAnswer[i].answer + '</p>';
                                }
                                let appendHtml = '';
                                if (rid != res.data.rInfo.id) {
                                    appendHtml +=  '<strong>ID:</strong><a href="/extend/professionalInfo?id='+ res.data.rInfo.id +'" target="_blank">'+ res.data.rInfo.id +'</a>' +
                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>标题:</strong>'+ res.data.rInfo.title;
                                }
                                appendHtml += '<p>' + res.data.multiInfo.des + '</p> ' + showPathHtml;
                                $('.nextQuestionShowPath').append(appendHtml);
                            }
                        }
                    })
                }
            }
        } else if (type == 6) {
            $('.link-tool-box').hide();
            $('.link-rand-box').show();
            let html = '';
            let idList = [];
            let next_info = $(this).data('next');
            let id = next_info['id'];
            for (let i in $(this).data('answer')) {
                let answerInfo = $(this).data('answer')[i]['answer'];
                answerInfo = JSON.parse(answerInfo);
                idList.push(answerInfo['id']);
                html = html + '<p> - '+ $(this).data('answer')[i]['name'] +'</p>'
            }
            $('.nextQuestionShowPath').empty().append('<input type="hidden" name="nextQuestionInfo" data-id="'+idList.join(',')+'" data-type="1">');
            $('.nextQuestionShowPath').append(html);
            $('.randEndShowPath').empty();
            $('.randEndShowPath').append('<input type="hidden" name="randEndQuestionInfo" data-id="'+ id +'" data-type="1">');
            $.ajax({
                url: '/multi/getMultiInfoById',
                type: 'POST',
                data: {id: id, type: 1},
                dataType: 'json',
                success: function (res) {
                    if (res.data.multiInfo != null) {
                        let appendHtml = '';
                        appendHtml += '<p>结束跳转：' + res.data.multiInfo.des + '</p> ';
                        $('.randEndShowPath').append(appendHtml);
                    }
                }
            })
        }
        $('.masking').fadeIn();
    });
    // 弹出框内 答案添加按钮点击
    $('body').on('click', '.answerAdd', function () {
        $('.answerListPath').append(
            '<div class="modules" style="margin-bottom: 5px">' +
            '<div class="m_title">' +
            '<input class="answerDes blurChangePreview">' +
            '<input class="answerSort sortChangePreview">' +
            '<a class="glyphicon glyphicon-ban-circle answerDesDelete" style="cursor: pointer;color: #000000; text-decoration: none;"></a>' +
            '</div>' +
            '</div>');
    });
    // 弹出框 答案删除按钮点击删除答案
    $('body').on('click', '.answerDesDelete', function () {
        let index = $(this).parent().parent().index();
        let id = $('.questionAnswerPath').children().eq(index).find('input').data('selfid');
        if (id != 0) {
            $.ajax({
                'url': '/question/answerDelete',
                'type': 'POST',
                'data': {'id': id},
                'dataType': 'json'
            });
        }
        $(this).parent().parent().remove();

        $('.questionAnswerPath').children().eq(index).remove();
    });
    // 点击右上角关闭X关闭弹出窗
    $('body').on('click', '.close', function () {
        $('.masking').hide();
    });
    // 题目编辑完成后修改preview显示
    if ($("#container").length > 0) {
        UE.getEditor('container').addListener('blur',function(editor){
            $('.questionShowPath').empty().append(this.getContent().toString());
        });
    }

    // Choice Item blur 取消选定后 根据index修改或添加
    $('body').on('blur', '.blurChangePreview',function () {
        let index=$(this).parent().parent().index();
        if (index < $('.questionAnswerPath').children().length) {
            $('.questionAnswerPath').children().eq(index).find('.previewChoice').empty().append($(this).val())
        } else {
            $('.questionAnswerPath').append('<div><input type="radio" name="previewAnswerRadio" data-type="0" data-id="0" data-selfId="0"> <span class="previewChoice">'+ $(this).val() +'</span></div>');
        }
    });

    $('body').on('blur', '.sortChangePreview', function () {
        let index = $(this).parent().parent().index();
        if (index < $('.questionAnswerPath').children().length) {
            $('.questionAnswerPath').children().eq(index).find('[name=previewAnswerRadio]').attr("data-sort", $(this).val()).data("sort", $(this).val());
        } else {
            alert("请先编辑选项");
        }
    });
    // Preview 内ChoiceItem点击, 在Next中显示该选项的一下个链接题;
    $('body').on('click', '[name=previewAnswerRadio]', function () {
        $('.nextQuestionShowPath').empty();
        let id = $(this).data('id');
        let rid = $(this).data('rid');
        let type = $(this).data('type');
        let href = $(this).data('href');
        if (type == 2 || type == 3) {
            $('.nextQuestionShowPath').empty().append('<span class="help-block">结束</span>');
            return 0;
        }
        if (type == 6) {
            let page = (href == "pages/ai_home/treate_list" ? "专业话术列表" : (href == "pages/music/music_album" ? "冥想列表" : "测评列表"));
            $('.nextQuestionShowPath').empty().append('<span class="help-block">跳转小程序: '+page+'</span>');
            return 0;
        }
        if (id == 0 && type != 6) {
            $('.nextQuestionShowPath').append('<span class="help-block">点击工具栏编辑</span>');
            return 0;
        }
        if (type == 4) {
            $('.nextQuestionShowPath').empty().append('<input type="hidden" name="nextQuestionInfo" data-id="'+$(this).data('id')+'" data-type="4">' +
                '<p>'+$(this).data('title')+'</p>' +
                '<input class="btn btn-xs btn-info" name="modelQuestionExitChooseBtn" value="选择出口">' +
                '<div class="outQuestionPath"><input type="hidden" name="modelOutQuestion" data-id="'+$(this).data('outquestionid')+'">' +
                '<p>'+$(this).data('outquestiondes')+'</p></div>'
            );
            return 0;
        }
        $.ajax({
            url: '/multi/getMultiInfoById',
            type: 'POST',
            data: {id: id, type: type, rid: rid},
            dataType: 'json',
            success: function (res) {
                let showPathHtml = '';
                for (let i =0; i < res.data.multiAnswer.length; i ++) {
                    showPathHtml = showPathHtml + '<p><input type="radio" name="nextPreviewRadio"> '+ res.data.multiAnswer[i].answer +'</p>';
                }
                if (res.data.multiInfo) {
                    let appendHtml = '';
                    if (rid != res.data.rInfo.id) {
                        appendHtml +=  '<strong>ID:</strong><a href="/extend/professionalInfo?id='+ res.data.rInfo.id +'" target="_blank">'+ res.data.rInfo.id +'</a>' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>标题:</strong>'+ res.data.rInfo.title;
                    }
                    appendHtml += '<p>' + res.data.multiInfo.des + '</p> ' + showPathHtml;
                    $('.nextQuestionShowPath').append(appendHtml);
                } else {
                    $('.nextQuestionShowPath').append('<span class="help-block">点击工具栏编辑</span>');
                }
            }
        })
    });
    // 工具栏点击 弹出二级
    $('.tool-inlink').click(function () {
        let questionId = $('input[name=questionId]').val();
        let questionList = $('[name=questionListValue]').val();
        questionList = JSON.parse(questionList);
        let str = '';
        for (let i = questionList.length - 1; i >= 0; i--) {
            if (questionList[i]['id'] != questionId) {
                str = str + '<tr>' +
                    '<td>'+ (i + 1) +'</td>' +
                    '<td>'+ questionList[i]["des"] +'</td>' +
                    '<td><button name="inlinkButtonClick" class="btn btn-xs btn-success" value="'+ questionList[i]["id"] +'">选择</button></td>' +
                    '</tr>'
            } else {
                str = str + '<tr>' +
                    '<td>'+ (i + 1) +'</td>' +
                    '<td style="color: darkgray;">'+ questionList[i]["des"] +'</td><td><button name="inlinkButtonClick" class="btn btn-xs btn-success" value="'+ questionList[i]["id"] +'">选择</button></td></tr>'
            }
        }
        $('.tool_path').empty().append(
            '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
            '</table>'
        );
        $('.tool_layer').fadeIn();
    });
    // 工具栏点击 随机推荐
    $('.tool-randlink').click(function () {
        let questionId = $('input[name=questionId]').val();
        let questionList = $('[name=questionListValue]').val();
        questionList = JSON.parse(questionList);
        let str = '';
        for (let i = questionList.length - 1; i >= 0; i--) {
            if (questionList[i]['id'] != questionId) {
                str = str + '<tr><td>'+ questionList[i]["des"] +'</td><td>' +
                    '<input type="checkbox" name="randlinkButtonClick" class="btn btn-xs btn-success" data-id="'+ questionList[i]["id"] +'" data-des="'+ questionList[i]["des"] +'"></td></tr>'
            }
        }
        $('.tool_path').empty().append(
            '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
            '</table>' +
            '<input class="btn btn-success btn-xs randLinkSave" style="float: right; margin: 10px" value="保存">'
        );
        $('.tool_layer').fadeIn();
    });
    // 工具栏点击 随机跳转所有跳转结束后固定跳转
    $('.tool-randEndLink').click(function () {
        let questionId = $('input[name=questionId]').val();
        let questionList = $('[name=questionListValue]').val();
        questionList = JSON.parse(questionList);
        let str = '';
        for (let i = questionList.length - 1; i >= 0; i--) {
            if (questionList[i]['id'] != questionId) {
                str = str + '<tr><td>'+ questionList[i]["des"] +'</td><td>' +
                    '<input type="radio" name="randlinkButtonClick" class="btn btn-xs btn-success" data-id="'+ questionList[i]["id"] +'" data-des="'+ questionList[i]["des"] +'"></td></tr>'
            }
        }
        $('.tool_path').empty().append(
            '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
            '</table>' +
            '<input class="btn btn-success btn-xs randEndLinkSave" style="float: right; margin: 10px" value="保存">'
        );
        $('.tool_layer').fadeIn();
    });
    // 工具栏点击 弹出外连接选择页面
    $('.tool-outlink').click(function () {
        let rid = $('[name=rid]').val();
        $.ajax({
            type: 'post',
            url: '/multi/getOutLinkQuestion',
            data: {rid: rid},
            dataType: 'json',
            success:function (data) {
                let str = '';
                for (let x in data.data['outLink']) {
                    str = str + '<tr>' +
                        '<td class="col-md-1">'+ data.data['outLink'][x]['id'] +'</td>' +
                        '<td class="col-md-1">'+data.data['outLink'][x]['des']+'</td>' +
                        '<td class="col-md-4"></td>' +
                        '<td class="col-md-1"><input type="button" class="btn btn-xs btn-primary showAnswer" data-id="'+data.data['outLink'][x]['id']+'" value="显示答案"></td>' +
                        '</tr>';
                    if (data.data['outLink'][x]['questionList']) {
                        for (let i=0; i < data.data['outLink'][x]['questionList'].length; i++) {
                            str = str + '<tr style="display: none" class="answer'+data.data['outLink'][x]['id']+'">' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td>'+data.data['outLink'][x]['questionList'][i]['des']+'</td>' +
                                '<td><input type="button" class="btn btn-xs btn-primary outLinkQuestionSelect" ' +
                                'data-rid="'+data.data['outLink'][x]['id']+'" data-rname="'+data.data['outLink'][x]['des']+'" data-id="'+data.data['outLink'][x]['questionList'][i]['id']+'" value="选择"></td>' +
                                '</tr>';
                        }
                    }
                };
                $('.tool_path').empty().append(
                    '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
                    '</table>'
                );
                $('.tool_layer').fadeIn();
            }
        });
    });
    // 工具栏点击 弹出思维模块选择页面
    $('.tool-model').click(function () {
        let rid = $('[name=rid]').val();
        $.ajax({
            type: 'post',
            url: '/multi/getModelQuestion',
            data: {rid: rid},
            dataType: 'json',
            success:function (data) {
                let str = '';
                for (let x in data.data['ModelList']) {
                    str = str + '<tr>' +
                        '<td class="col-md-1">'+data.data['ModelList'][x]['title']+'</td>' +
                        '<td class="col-md-4"></td>' +
                        '<td><input type="button" class="btn btn-xs btn-primary modelQuestionSelect" data-id="'+data.data['ModelList'][x]['id']+'"' +
                        ' data-title="'+data.data['ModelList'][x]['title']+'" value="选择"></td>' +
                        '</tr>';
                };
                $('.tool_path').empty().append(
                    '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
                    '</table>'
                );
                $('.tool_layer').fadeIn();
            }
        });
    });
    // 工具栏点击 结束按钮点击
    $('.tool-end').click(function () {
        let type = $('[name=questionType]').val();
        let professional_type = $('[name=professional_type]').val();
        if (professional_type == 3 || professional_type == 7) {
            $('.nextQuestionShowPath').empty().append('<input type="hidden" name="nextQuestionInfo" data-id="4000" data-type="2"><span class="help-block">结束</span>');
            if (type == 1) {
                $('[name=previewAnswerRadio]:checked').data('type', 2);
                $('[name=previewAnswerRadio]:checked').data('id', 4000);
                $('[name=previewAnswerRadio]:checked').attr('data-type', 2);
                $('[name=previewAnswerRadio]:checked').attr('data-id', 4000);
            }
        } else {
            $('.nextQuestionShowPath').empty().append('<input type="hidden" name="nextQuestionInfo" data-id="0" data-type="3"><span class="help-block">结束</span>');
            if (type == 1) {
                $('[name=previewAnswerRadio]:checked').data('type', 3);
                $('[name=previewAnswerRadio]:checked').data('id', 0);
                $('[name=previewAnswerRadio]:checked').attr('data-type', 3);
                $('[name=previewAnswerRadio]:checked').attr('data-id', 0);
            }
        }

    });
    // 推荐工具栏 推荐音乐点击
    $('.tool-music').click(function () {
        $('.tool_path').empty().append(
            '<div style="margin: 15px">' +
            '<input class="form-control" style="width: 90%" name="recommend_keyword"> ' +
            '<input type="button" style="float: right; margin-right: 10%" class="btn btn-primary toolMusicSearchButton" value="搜索">' +
            '</div>' +
            '<table name="RecommendTable" style="margin: 50px 20px 0 20px; width: 95%">' +
            '</table>');
        addMusicList('');
        $('.tool_layer').fadeIn();
    });
    // 推荐工具栏 推荐文章点击
    $('.tool-article').click(function () {
        $('.tool_path').empty().append(
            '<div style="margin: 15px">' +
            '<input class="form-control" style="width: 90%" name="recommend_keyword"> ' +
            '<input type="button" style="float: right; margin-right: 10%" class="btn btn-primary toolArticleSearchButton" value="搜索">' +
            '</div>' +
            '<table name="RecommendTable" style="margin: 50px 20px 0 20px; width: 95%">' +
            '</table>');
        addArticleList('');
        $('.tool_layer').fadeIn();
    });
    // 推荐工具栏 推荐测评点击
    $('.tool-test').click(function () {
        $('.tool_path').empty().append(
            '<div style="margin: 15px">' +
            '<input class="form-control" style="width: 90%" name="recommend_keyword"> ' +
            '<input type="button" style="float: right; margin-right: 10%" class="btn btn-primary toolTestSearchButton" value="搜索">' +
            '</div>' +
            '<table name="RecommendTable" style="margin: 50px 20px 0 20px; width: 95%">' +
            '</table>');
        addTestList('');
        $('.tool_layer').fadeIn();
    });
    // 推荐工具栏 推荐测评点击
    $('.tool-video').click(function () {
        $('.tool_path').empty().append(
            '<div style="margin: 15px">' +
            '<input class="form-control" style="width: 90%" name="recommend_keyword"> ' +
            '<input type="button" style="float: right; margin-right: 10%" class="btn btn-primary toolTestSearchButton" value="搜索">' +
            '</div>' +
            '<table name="RecommendTable" style="margin: 50px 20px 0 20px; width: 95%">' +
            '</table>');
        addVideoList('');
        $('.tool_layer').fadeIn();
    });
    // 音乐推荐  搜索按钮点击
    $('body').on('click', '.toolMusicSearchButton', function () {
        let title = $('[name=recommend_keyword]').val();
        addMusicList(title);
    });
    // 文章推荐  搜索按钮点击
    $('body').on('click', '.toolArticleSearchButton', function () {
        let title = $('[name=recommend_keyword]').val();
        addArticleList(title);
    });
    // 测试推荐  搜索按钮点击
    $('body').on('click', '.toolTestSearchButton', function () {
        let title = $('[name=recommend_keyword]').val();
        addTestList(title);
    });
    // 音乐推荐 选择按钮点击 添加推荐内容 关闭推荐框
    $('body').on('click', '.musicSelectButton', function () {
        let id = $(this).data('id');
        $('.RecommendRangeShowPath').append(
            '<tr style="height: 30px">' +
            '   <td>'+ $(this).parent().parent().children().eq(0).text() +'</td>' +
            '   <td>音乐</td>' +
            '   <td>' +
            '       <input type="button" class="btn btn-xs btn-danger RecommendRemoveButton" data-selfid="0" data-id="'+id+'" data-type="6" value="删除">' +
            '   </td>' +
            '</tr>'
        );
        $('.tool_layer').hide();
    });
    // 文章推荐 选择按钮点击 添加推荐内容 关闭推荐框
    $('body').on('click', '.articleSelectButton', function () {
        let id = $(this).data('id');
        $('.RecommendRangeShowPath').append(
            '<tr style="height: 30px">' +
            '   <td>'+ $(this).parent().parent().children().eq(0).text() +'</td>' +
            '   <td>文章</td>' +
            '   <td>' +
            '       <input type="button" class="btn btn-xs btn-danger RecommendRemoveButton" data-selfid="0" data-id="'+id+'" data-type="8" value="删除">' +
            '   </td>' +
            '</tr>'
        );
        $('.tool_layer').hide();
    });
    // 测试推荐 选择按钮点击 添加推荐内容 关闭推荐框
    $('body').on('click', '.testSelectButton', function () {
        let id = $(this).data('id');
        $('.RecommendRangeShowPath').append(
            '<tr style="height: 30px">' +
            '   <td>'+ $(this).parent().parent().children().eq(0).text() +'</td>' +
            '   <td>测评</td>' +
            '   <td>' +
            '       <input type="button" class="btn btn-xs btn-danger RecommendRemoveButton" data-selfid="0" data-id="'+id+'" data-type="2" value="删除">' +
            '   </td>' +
            '</tr>'
        );
        $('.tool_layer').hide();
    });
    // 视频推荐 选择按钮点击 添加推荐内容 关闭推荐框
    $('body').on('click', '.videoSelectButton', function () {
        let id = $(this).data('id');
        $('.RecommendRangeShowPath').append(
            '<tr style="height: 30px">' +
            '   <td>'+ $(this).parent().parent().children().eq(0).text() +'</td>' +
            '   <td>视频</td>' +
            '   <td>' +
            '       <input type="button" class="btn btn-xs btn-danger RecommendRemoveButton" data-selfid="0" data-id="'+id+'" data-type="9" value="删除">' +
            '   </td>' +
            '</tr>'
        );
        $('.tool_layer').hide();
    });
    // 工具栏弹窗关闭按钮
    $('.tool_close').click(function () {
        $('.tool_layer').hide();
    });
    // 多选链接保存按钮点击
    $('body').on('click', '.randLinkSave', function () {
        let idList = [];
        let textList = [];
        $('[name=randlinkButtonClick]:checked').each(function () {
            idList.push($(this).data('id'));
            textList.push($(this).data('des'));
        });
        $('.nextQuestionShowPath').empty();
        $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="'+ idList.join(',') +'" data-type="1">');
        for (let i in textList) {
            $('.nextQuestionShowPath').append('<p> - '+ textList[i] +'</p>');
        }
        $('.tool_layer').hide();
    });
    // 多选结束保存按钮点击
    $('body').on('click', '.randEndLinkSave', function () {
        let id = $('[name=randlinkButtonClick]:checked').data('id');
        let test = $('[name=randlinkButtonClick]:checked').data('des');
        $('.randEndShowPath').empty();
        $('.randEndShowPath').append('<input type="hidden" name="randEndQuestionInfo" data-id="'+ id +'" data-type="1">');
        $('.randEndShowPath').append('<p> 结束跳转： '+ test +'</p>');
        $('.tool_layer').hide();
    });
    // 内链接选择按钮点击
    $('body').on('click', '[name=inlinkButtonClick]', function () {
        let type = $('[name=questionType]').val()
        $('.nextQuestionShowPath').empty();
        $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="'+$(this).val()+'" data-type="1">');
        $.ajax({
            url: '/multi/getMultiInfoById',
            type: 'POST',
            data: {id: $(this).val(), type: 1},
            dataType: 'json',
            success: function (res) {
                let showPathHtml = '';
                for (let i =0; i < res.data.multiAnswer.length; i ++) {
                    showPathHtml = showPathHtml + '<p><input type="radio" name="nextPreviewRadio"> '+ res.data.multiAnswer[i].answer +'</p>';
                }
                $('.nextQuestionShowPath').append(
                    '<p>'+ res.data.multiInfo.des +'</p> '+ showPathHtml
                );
            }
        });
        if (type == 1) {
            $('[name=previewAnswerRadio]:checked').data('type', 1);
            $('[name=previewAnswerRadio]:checked').data('id', $(this).val());
            $('[name=previewAnswerRadio]:checked').attr('data-type', 1);
            $('[name=previewAnswerRadio]:checked').attr('data-id', $(this).val());
        }

        $('.tool_layer').hide();
    });
    // 外链接选择按钮点击
    $('body').on('click', '.outLinkQuestionSelect', function () {
        let type = $('[name=questionType]').val()
        $('.nextQuestionShowPath').empty();
        $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="'+$(this).data('id')+'" data-type="1">');
        let rid = $(this).data('rid');
        let rname = $(this).data('rname');
        $.ajax({
            url: '/multi/getMultiInfoById',
            type: 'POST',
            data: {id: $(this).data('id'), type: 1},
            dataType: 'json',
            success: function (res) {
                let showPathHtml = '';
                for (let i =0; i < res.data.multiAnswer.length; i ++) {
                    showPathHtml = showPathHtml + '<p><input type="radio" name="nextPreviewRadio"> '+ res.data.multiAnswer[i].answer +'</p>';
                }
                $('.nextQuestionShowPath').append(
                    '<p>ID:'+ rid +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话术名:'+ rname +'</p>' +
                    '<p>'+ res.data.multiInfo.des +'</p> '+ showPathHtml
                );
            }
        });
        if (type == 1) {
            $('[name=previewAnswerRadio]:checked').data('type', 1);
            $('[name=previewAnswerRadio]:checked').data('id', $(this).data('id'));
            $('[name=previewAnswerRadio]:checked').attr('data-type', 1);
            $('[name=previewAnswerRadio]:checked').attr('data-id', $(this).data('id'));
        }

        $('.tool_layer').hide();
    });
    // 思维模块选择按钮点击
    $('body').on('click', '.modelQuestionSelect', function () {
        let type = $('[name=questionType]').val()
        $('.nextQuestionShowPath').empty();
        $('.nextQuestionShowPath').append('<input type="hidden" name="nextQuestionInfo" data-id="'+$(this).data('id')+'" data-type="4">');
        $('.nextQuestionShowPath').append(
            '<p>'+ $(this).data('title') +'</p>' +
            '<input class="btn btn-xs btn-info" name="modelQuestionExitChooseBtn" value="选择出口">'
        );
        if (type == 1) {
            $('[name=previewAnswerRadio]:checked').data('type', 4);
            $('[name=previewAnswerRadio]:checked').data('id', $(this).data('id'));
            $('[name=previewAnswerRadio]:checked').data('title', $(this).data('title'));
            $('[name=previewAnswerRadio]:checked').attr('data-type', 4);
            $('[name=previewAnswerRadio]:checked').attr('data-id', $(this).data('id'));
            $('[name=previewAnswerRadio]:checked').attr('data-title', $(this).data('title'));

        }

        $('.tool_layer').hide();
    });
    //思维模块出口设置btn点击
    $('body').on('click', '[name=modelQuestionExitChooseBtn]', function () {
        let questionId = $('input[name=questionId]').val();
        let questionList = $('[name=questionListValue]').val();
        questionList = JSON.parse(questionList);
        let str = '';
        for (let i = questionList.length - 1; i >= 0; i--) {
            if (questionList[i]['id'] != questionId) {
                str = str + '<tr><td>'+ questionList[i]["des"] +'</td><td><button name="modelQuestionOutButtonClick" class="btn btn-xs btn-success" ' +
                    'value="'+ questionList[i]["id"] +'" data-des="'+ questionList[i]["des"] +'">选择</button></td></tr>'
            }
        }
        $('.tool_path').empty().append(
            '<table class="table table-hover" style="margin: 50px 20px 0 20px; width: 95%">' + str +
            '</table>'
        );
        $('.tool_layer').fadeIn();
    });
    // 思维模块出口题目选择，添加
    $('body').on('click', '[name=modelQuestionOutButtonClick]', function () {
        let type = $('[name=questionType]').val();
        $('.outQuestionPath').empty();
        $('.nextQuestionShowPath').append('<div class="outQuestionPath"><input type="hidden" name="modelOutQuestion" data-id="'+$(this).val()+'">' +
            '<p>'+$(this).data('des')+'</p></div>');
        if (type == 1) {
            $('[name=previewAnswerRadio]:checked').data('outquestionid', $(this).val());
            $('[name=previewAnswerRadio]:checked').data('outquestiondes', $(this).data('des'));
            $('[name=previewAnswerRadio]:checked').attr('data-outquestionid', $(this).val());
            $('[name=previewAnswerRadio]:checked').attr('data-outquestiondes', $(this).data('des'));
        }
        $('.tool_layer').hide();
    });
    // 题目类型选择变更编辑页变化
    $('[name=questionType]').change(function () {
        $('.nextQuestionShowPath').empty().append('<p class="help-block">请选择想要编辑的选项</p>');
        $('.questionAnswerPath').hide();
        $('.singleChoice').hide();
        $('.FreeInput').hide();
        $('.RecommendInput').hide();
        $('.link-rand-box').hide();
        $('.link-tool-box').show();
        $('.professionalNextPath').show();
        if ($(this).val() == 1) {
            $('.questionAnswerPath').fadeIn();
            $('.singleChoice').fadeIn();
        } else if ($(this).val() == 4) {
            $('.FreeInput').fadeIn();
        }  else if ($(this).val() == 3) {
            $('.RecommendInput').fadeIn();
        } else if ($(this).val() == 6) {
            $('.link-tool-box').hide();
            $('.link-rand-box').show();
        } else if ($(this).val() == 7) {
            $('.professionalNextPath').hide();
        }
    });
    // 推荐：推荐内容删除按钮
    $('body').on('click', '.RecommendRemoveButton', function () {
        $(this).parent().parent().remove();
        let id = $(this).data('selfid');
        if (id != 0) {
            $.ajax({
                url: '/recommend/deleteRecommendById',
                type: 'POST',
                data: {id: id},
                dataType: 'json',
                success: function (res) {
                    alert(res.msg);
                }
            });
        }
    });
    // 题目保存按钮点击, 修改话术标题, 标签与分类
    $('.questionInfoSave').click(function () {
        let title = $('[name=title]').val();
        let type = $('[name=question_type]').val();
        let rid = $('[name=rid]').val();
        let professional_type = $('[name=type]').val();
        let show_name = $('[name=miniprogram_show_name]').val();
        let show_flag = $('[name=miniprogram_show_flag]').prop('checked');
        let pic = $('[name=pic_path]').val();
        let label_list = [];

        $('.label_select').each(function () {
            if ($(this).val()) {
                label_list = label_list.concat($(this).val())
            }
        });
        $('[name=label]').val(label_list.join(','));
        $.ajax({
            'type': 'POST',
            'url': '/resolution/edit',
            'data': {title: title, type: type, rid:rid, professional_type: professional_type, label: $('[name=label]').val(),
                miniprogram_show_name: show_name, miniprogram_show_flag: show_flag, sort: $('[name=sort]').val(), pic: pic},
            'dataType': 'json',
            success:function (res) {
                alert(res.msg);
                if (res.code == 1) {
                    window.location.href = res.data['link'];
                }
            }
        });
    });
    // 保存按钮点击 保存问题, 关闭编辑弹窗
    $('.questionSaveButton').click(function () {
        let rid = $('[name=rid]').val();
        let questionType = $('[name=questionType]').val();
        let questionId = $('input[name=questionId]').val();
        let questionDes = "";

        let reset_attribute = $("[name=reset_attribute]").prop("checked");
        if (reset_attribute === true) {
            reset_attribute = "used_id";
        } else {
            reset_attribute = "";
        }


        UE.getEditor('container').ready(function () {
            questionDes =  this.getContent().toString();
        });
        if (questionType == 1) {
            let user_attribute = $('[name=single_user_attribute]').val()
            let answerList = [];

            $('.questionAnswerPath input').each(function () {
                let data = {};
                data.des = $(this).parent().children().eq(1).text();
                data.type = $(this).data('type');
                data.id = $(this).data('id');
                data.href = $(this).data('href');
                data.selfId = $(this).data('selfid');
                data.outQuestionId = $(this).data('outquestionid');
                data.sort = $(this).data('sort');
                answerList.push(data);
            });
            $.ajax({
                type: 'POST',
                url: '/question/Edit',
                data: {questionId: questionId, type: questionType, des: questionDes, answerList: answerList, rid: rid, user_attribute: user_attribute, reset_attribute: reset_attribute},
                dataType: 'json',
                success: function (data) {
                    if (data.code == 1) {
                        window.location.reload();
                    }
                }
            });
        } else if (questionType == 4 || questionType == 5 || questionType == 6) {
            let data = {};
            let user_attribute = $('[name=free_input_user_attribute]').val();
            data.type = $('[name=nextQuestionInfo]').data('type');
            data.id = $('[name=nextQuestionInfo]').data('id');
            data.outQuestionId = $('[name=modelOutQuestion]').data('id');
            let ai_match = $('[name=ai_match]').prop("checked");
            let randEndQuestionId = $('[name=randEndQuestionInfo]').data('id');
            $.ajax({
                type: 'POST',
                url: '/question/Edit',
                data: {'questionId': questionId, 'type': questionType, 'des': questionDes, 'next_id': data, 'rid': rid, 'user_attribute': user_attribute, ai_match: ai_match, randEndQuestionId: randEndQuestionId, reset_attribute: reset_attribute},
                dataType: 'json',
                success: function (data) {
                    alert(data.msg);
                    if (data.code == 1) {
                        window.location.reload();
                    }
                }
            });
        } else if (questionType == 3) {
            let next = {};
            next.type = $('[name=nextQuestionInfo]').data('type');
            next.id = $('[name=nextQuestionInfo]').data('id');
            next.outQuestionId = $('[name=modelOutQuestion]').data('id');
            let recommendList = [];
            $('.RecommendRangeShowPath .RecommendRemoveButton').each(function () {
                let data = {};
                data.content_id = $(this).data('id');
                data.type_id = $(this).data('type');
                data.selfId = $(this).data('selfid');
                recommendList.push(data);
            });
            $.ajax({
                type: 'POST',
                url: '/question/Edit',
                data: {'questionId': questionId, 'type': 3, 'des': questionDes, 'recommendList': recommendList, 'rid': rid, 'next_id': next, reset_attribute: reset_attribute},
                dataType: 'json',
                success: function (data) {
                    alert(data.msg);
                    if (data.code == 1) {
                        window.location.reload();
                    }
                }
            });
        } else if (questionType == 7) {
            $.ajax({
                type: 'POST',
                url: '/question/Edit',
                data: {'questionId': questionId, 'type': 7, 'des': questionDes, 'rid': rid, reset_attribute: reset_attribute},
                dataType: 'json',
                success: function (data) {
                    alert(data.msg);
                    if (data.code == 1) {
                        window.location.reload();
                    }
                }
            });
        }
    });
    //添加用户属性标签
    $('.addUserAttribute').click(function () {
        $('.userAttributeInput').fadeIn();
        $('.saveUserAttribute').fadeIn();
        $(this).fadeOut();
    });
    // 保存用户属性标签
    $('.saveUserAttribute').click(function () {
        let userAttribute = $('.userAttributeInput').val();
        $.ajax({
            url: '/userAttribute/save',
            type: 'POST',
            data: {'userAttribute':userAttribute},
            dataType: 'json',
            success:function () {
                window.location.reload();
            }
        });
    });

    //添加用户属性标签
    $('.openLink').click(function () {
        $("body .showAnswer").trigger("click");
        $('.closeLink').fadeIn();
        $(this).fadeOut();
    });
    // 保存用户属性标签
    $('.closeLink').click(function () {
        $("body .closeAnswer").trigger("click");
        $('.openLink').fadeIn();

        $(this).fadeOut();
    });
});

function addMusicList(title) {
    $.ajax({
        type: 'post',
        url: '/recommend/getRecommendList',
        data: {title: title, type: 1},
        dataType: 'json',
        success:function (data) {
            let str = '';
            for (let x in data.data['list']) {
                str = str + '<tr style="height: 30px;border-top: 1px solid #ddd">' +
                    '<td class="col-md-5">'+data.data['list'][x]['title']+'</td>' +
                    '<td class="col-md-1"><input type="button" class="btn btn-xs btn-primary musicSelectButton" data-id="'+data.data['list'][x]['id']+'" value="选择"></td>' +
                    '</tr>';
            };
            $('[name=RecommendTable]').empty().append(str);
        }
    });
}

function addArticleList(title) {
    $.ajax({
        type: 'post',
        url: '/recommend/getRecommendList',
        data: {title: title, type: 2},
        dataType: 'json',
        success:function (data) {
            let str = '';
            for (let x in data.data['list']) {
                str = str + '<tr style="height: 30px;border-top: 1px solid #ddd">' +
                    '<td class="col-md-5">'+data.data['list'][x]['title']+'</td>' +
                    '<td class="col-md-1"><input type="button" class="btn btn-xs btn-primary articleSelectButton" data-id="'+data.data['list'][x]['art_id']+'" value="选择"></td>' +
                    '</tr>';
            };
            $('[name=RecommendTable]').empty().append(str);
        }
    });
}

function addTestList(title) {
    $.ajax({
        type: 'post',
        url: '/recommend/getRecommendList',
        data: {title: title, type: 3},
        dataType: 'json',
        success:function (data) {
            let str = '';
            for (let x in data.data['list']) {
                str = str + '<tr style="height: 30px;border-top: 1px solid #ddd">' +
                    '<td class="col-md-5">'+data.data['list'][x]['title']+'</td>' +
                    '<td class="col-md-1"><input type="button" class="btn btn-xs btn-primary testSelectButton" data-id="'+data.data['list'][x]['id']+'" value="选择"></td>' +
                    '</tr>';
            };
            $('[name=RecommendTable]').empty().append(str);
        }
    });
}

function addVideoList(title) {
    $.ajax({
        type: 'post',
        url: '/recommend/getRecommendList',
        data: {title: title, type: 4},
        dataType: 'json',
        success:function (data) {
            let str = '';
            for (let x in data.data['list']) {
                str = str + '<tr style="height: 30px;border-top: 1px solid #ddd">' +
                    '<td class="col-md-5">'+data.data['list'][x]['title']+'</td>' +
                    '<td class="col-md-1"><input type="button" class="btn btn-xs btn-primary videoSelectButton" data-id="'+data.data['list'][x]['id']+'" value="选择"></td>' +
                    '</tr>';
            };
            $('[name=RecommendTable]').empty().append(str);
        }
    });
}

function picture_upload_click() {
    $("#pictureFile").click();
}

function pictureChange() {
    $.ajax({
        url:"/picUpload",
        type: 'POST',
        cache: false,
        data: new FormData($('#uploadPicture')[0]),
        processData: false,
        contentType: false,
        dataType:'json',
        success: function (data) {
            let val = "";
            UE.getEditor('container').ready(function () {
                val =  this.getContent().toString();
            });
            val = val + "<img src=http://resource.soulbuddy.cn/public/uploads/testing/"+data.data+" style=width:100% />";
            UE.getEditor('container').ready(function () {
                ue.setContent(val);
            });
        }
    });
};