$(".pp").on("click",function(){
    var _pp = $(".pp");
    if(!$(this).hasClass("active")){
        $(this).addClass("active");
    }else{
        $(this).removeClass("active");
    }
})
$(".th").on("click",function(){
    var _pp = $(".th");
    if(!$(this).hasClass("active")){
        $(this).addClass("active");
    }else{
        $(this).removeClass("active");
    }
})
$(".xb").on("click",function(){
    var _pp = $(".xb");
    if(!$(this).hasClass("active")){
        $(this).addClass("active");
    }else{
        $(this).removeClass("active");
    }
})
$(".pt").on("click",function(){
    var _pp = $(".pt");
    if(!$(this).hasClass("active")){
        _pp.removeClass("active");
        $(this).addClass("active");
    }
})
$(".sj").on("click",function(){
    var _pp = $(".sj");
    if(!$(this).hasClass("active")){
        _pp.removeClass("active");
        $(this).addClass("active");
    }
})
$(".yh").on("click",function(){
    var _pp = $(".yh");
    if(!$(this).hasClass("active")){
        _pp.removeClass("active");
        $(this).addClass("active");
    }
})

$('.pushTe').bind('input propertychange','textarea',function(){
    // console.log($(this).val().length)
    if($(this).val().length<=50){
        document.getElementById('nrCont').innerHTML = $(this).val().length;
    }
});
$('.titleInput').bind('input propertychange','textarea',function(){
    // console.log($(this).val().length)
    if($(this).val().length<=20){
        document.getElementById('tiCont').innerHTML = $(this).val().length;
    }
});
function limitImport(str,num){
        $(document).on('input propertychange',str,function(){
            var self = $(this);
            var content = self.val();
            if (content.length > num){
                self.val(content.substring(0,num));
            } 
            self.siblings('span').text(self.val().length+'/'+num);
        });
    }

//用法示例
limitImport('.pushTe',50);
limitImport('.titleInput',20);

var unloaderror = '请上传图片';
$(document).on("change", ".js-uploadimg", function(){
    var $self = $(this),
        arr_data = $self.val().split("\\"),
        filename = arr_data[arr_data.length - 1];

    var partten = /.png|.jpg|.jpeg|.gif$/;
    
    if (partten.test(filename.toLowerCase())) {
        renderImg(this); //预览图片
        $self.siblings('.js-img').show(500);
        //saveReport();
    } else {
        alert(unloaderror);
    }
});
//渲染图片
function renderImg(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var base64 = e.target.result;
            $(input).siblings("img").attr('src', base64).fadeIn(500);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
//表单上传头像
function saveReport() { 
    // jquery 表单提交 
    $('#js-form')[0].action=$('#js-form')[0].action+"&toekn="+localStorage.token; 
    $('#js-form').ajaxSubmit(function(message) { 
        console.log(message);
    }); 
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转 
} 
//radio
$('input:radio').click(function(){
	return ;
    if($(this).val()==3){
        $(".sj").removeClass("active");
        $(".sj:eq(0)").addClass("active");
    }else{
        $(".sj").removeClass("active");
    }
    if($(this).val()==4){
        rem();
        $(".pt:eq(0)").addClass("active");
    }else{
        rem();
    }
});
function rem(){
    $(".pt").removeClass("active");
    $(".yh").removeClass("active");
    $(".xb").removeClass("active");
    $(".th").removeClass("active");
    $(".pp").removeClass("active");
}