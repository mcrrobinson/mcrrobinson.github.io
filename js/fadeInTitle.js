setTimeout(function() {
    $("#mainTitle").fadeOut(function() {
        $(this).text("Matt Robinson").fadeIn("fast");
    });
    $("#secondTitle").delay(2000).fadeIn("2000");
}, 2000);