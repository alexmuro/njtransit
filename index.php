<!doctype html>
<html lang="en" ng-app="myApp">
    <head>
        <meta charset="utf-8">
        <title>AVAIL TDM Admin - NJTransit</title>
        <link rel="stylesheet" href="admin/css/app.css"/>
        <link rel="stylesheet" href="admin/css/custom.css"/>
        <script src="resources/js/jquery-1.9.1.min.js"></script>
        <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
        <!--[if lt IE 9]>
          <script src="js/lib/html5shiv.js"></script>
        <![endif]-->
    </head>
    <body class='dark'> 
        <div class="container login-container">
            <div class="row login-row">
                <div class="span1 offset3">
                  <div class="login-icon">
                    <img src="admin/img/Login-Icon-Map.png" alt="Welcome to Mail App">
                    <div class="login-text">AVAIL /<br>NJTransit</div>
                        <div class='small-text'>
                        Tranist<br>
                        Demand<br>
                        Modeling
                        </div>
                  </div>
                </div>
                <div class="span4">
                    <div class="login-form">
                        <div class="control-group">
                          <input type="text" class="login-field" value="" placeholder="User" id="login-name">
                          <label class="login-field-icon fui-user" for="login-name"></label>
                        </div>

                        <div class="control-group">
                          <input type="password" class="login-field" value="" placeholder="Password" id="login-pass">
                          <label class="login-field-icon fui-lock" for="login-pass"></label>
                        </div>

                        <a id='login-btn' class="btn btn-inverse btn-large btn-block" href="#">Login</a>
                        <!-- <a class="login-link" href="#">Lost your password?</a> -->
                        <div class="alert alert-error hidden" style="margin-top: 15px;margin-bottom: 10px;">Incorrect username or password.</div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <script>
        $(function(){
            $('#login-btn').on('click',function(){
                $.ajax({url:'/data/get/login.php',
                        method:'POST',
                        data:{username:$('#login-name').val(),password:$('#login-pass').val()},
                        dataType: 'json'
                })
                .done(function(data){
                    if(data.status == 'success'){
                        window.location.href=data.redirect;
                    }else{
                        $('.alert')
                            .addClass('hidden');
                       $('.alert')
                            .removeClass('hidden');
                    }
                })
                .fail(function(e){
                    console.log(e.responseText);
                })     
            });
        });
        </script>
</body>
</html>