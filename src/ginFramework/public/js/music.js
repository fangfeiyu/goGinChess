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
                $("#coverShowPath").empty().append('<img src="http://resource.soulbuddy.cn/public/uploads/musicPic/'+ data.data +'" style="width: 50px;height: 50px;">');
            }
        }
    });
}
function musicUpload() {
    $.ajax({
        url:"/picUpload",
        type: 'POST',
        cache: false,
        data: new FormData($('.music_upload')[0]),
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (data) {
            if (data.code === 0) {
                alert(data.msg);
            } else {
                $('#musicAddPath').val(data.data);
                $("#musicAddListenAudio").attr('src', 'http://resource.soulbuddy.cn/public/uploads/music/'+ data.data);
            }
        }
    });
}
$(function () {
    $('#edit').editable({
        inlineMode: false,
        alwaysBlank: true,
        language: "zh_cn",
        direction: "ltr",
        allowedImageTypes: ["jpeg", "jpg", "png", "gif"],
        autosave: true,
        autosaveInterval: 2500,
        saveParams: {id: "55555"},
        spellcheck: true,
        plainPaste: true,
        imageButtons: ["floatImageLeft", "floatImageNone", "floatImageRight", "linkImage", "replaceImage", "removeImage"],
        imageUploadParam:'myfile',
        imageUploadURL: '/index.php/System/upload',
        imageUploadParams: {path:"product_img", path_type:"resource"},
        enableScript: false
    });

    $("body").on("click", ".musicListDelete", function () {
        $(this).parent  ().parent().remove();
    });

    $(".musicSave").click(function () {
        let title = $("[name=music_title]").val();
        let sfile = $("#musicAddPath").val();
        $.ajax({
            url: "/music/update",
            type: "POST",
            data: {title: title, sfile: sfile, id: 0},
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    let html =  "<td>"+ res.data.id +"</td>" +
                        "<td>"+ title +"</td>" +
                        "<td><input type='hidden' name='musicIdList' value="+ res.data.id +"></td>" +
                        "<td><audio controls='controls' src='http://resource.soulbuddy.cn/public/uploads/music/"+ sfile +"'></audio></td>" +
                        "<td><a href='javascript:void (0);' class='musicListDelete btn btn-xs btn-danger'>删除</a></td>";
                    $(".musicSelectedList table").append("<tr></tr>");
                    $(".masking2").hide()
                }

            }
        })
    });

    // 点击音乐选择出现弹窗可选择音乐
    $(".musicListSelect").click(function () {
        let musicIdList = [];
        $("[name=musicIdList]").each(function () {
            if($(this))
            musicIdList.push(String($(this).val()));
        });

        $.ajax({
            url: "/music/total",
            type: "POST",
            dataType: "json",
            success: function (res) {
                let list = res.data.musicTotal;
                let html = "";
                for (let i in list) {
                    let selected = "";
                    if ($.inArray(String(list[i]["id"]), musicIdList) != "-1") {
                        selected = "checked";
                    } else {
                        selected = "";
                    }
                        html += "<tr>" +
                            "<td>"+ list[i]["id"] +"</td>" +
                            "<td>"+ list[i]["title"] +"</td>" +
                            "<td><input type='checkbox' name='musicSelectCheckbox' data-sfile="+ list[i]["sfile"] +" data-name="+ list[i]["title"] +" "+ selected +" value='"+ list[i]["id"] +"'></td>" +
                            "</tr>";
                }
                $(".musicListShow").empty().append("<table class='table table-hover'>"+ html +"</table>")
            }
        });
        $(".masking").show();
    });

    //点击弹窗保存选中音乐 刷新音乐展现列表
    $(".musicListSave").click(function () {
        let musicIdList = [];
        $("[name=musicSelectCheckbox]:checked").each(function () {
            musicIdList.push({name: $(this).data("name"),val:$(this).val(), sfile: $(this).data("sfile")});
        });
        $.ajax({
            url: "/music/link/insert",
            type: "POST",
            data: {musicIdList: musicIdList, collection_id: $(".collection_id").val()},
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    window.location.reload();
                }
            }
        })
    });

    $(".musicAddButton").click(function () {
        $('#music_file').click();
    });

    $(".musicAddMaskingShow").click(function () {
        $(".masking2").show();
    });

    $(".close2").click(function () {
        $(".masking2").hide();
    })

    $('.selectpicker').selectpicker({
        'selectedText': 'cat'
    });

    $(".btn-single").on("click", function () {
        if ($.trim($("input[name='title']").val()).length == 0){
            alert("请输入完整的信息");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/music/collection/update",
            dataType: "json",
            data: {
                id: $("[name=id]").val(),
                title: $("input[name='title']").val(),
                sort: $("input[name='sort']").val(),
                miniprogram_show_name: $("input[name='miniprogram_show_name']").val(),
                type: $("[name=type]").val(),
                intr: $("[name=intr]").val(),
                detail: $('#edit')[0].childNodes[1].innerHTML,
                img: $("[name=pic_path]").val(),
                content_keyword: $('[name=content_keyword]').val(),
            },
            success: function(res){
                if (res.code == 1) {
                    if (confirm(res.msg + ', 点击确认返回.')) {
                        window.location.href = '/music/collection/index';
                    } else {
                        window.location.reload(true);
                    }
                } else {
                    alert(res.msg);
                }

            }
        });
    });

    // 音乐合集删除按钮
    $(".btn-music-delete").click(function () {
        let id = $(this).data("id");
        if (confirm("是否确定删除？"))  {
            $.ajax({
                url: "/music/collection/delete",
                type: "POST",
                data: {id: id},
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        alert("删除成功");
                        window.location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            })
        }
    });
});