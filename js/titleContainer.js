setTimeout(function() {
    $('#titleContainer').fadeOut("slow", function(){
        var div = $("<div class='white_header headericon' id='titleContainer'><a href='#' class='underline'>Matt Robinson</a></div>").hide();
        $(this).replaceWith(div);
        $('#titleContainer').fadeIn("fast");
    });
}, 3000); // <-- time in milliseconds