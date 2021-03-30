<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}"> 

    <title>{{ config('app.name', 'B3NET Password Manager') }}</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{ asset('/public/plugins/fontawesome-free/css/all.min.css') }}">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css') }}">
    <!-- iCheck -->
    <link rel="stylesheet" href="{{ asset('/public/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">

    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('/public/dist/css/adminlte.min.css') }}">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="{{ asset('/public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}">
    <!-- Styles -->
    <link href="{{ asset('/resources/css/app.css') }}" rel="stylesheet">
    <script>
        if (typeof(Storage) !== "undefined") {
            <?php 
                $base_url =  URL::to('/');
                $base_url_arr = explode('/', $base_url);
                unset($base_url_arr[0]);
                unset($base_url_arr[1]);
                unset($base_url_arr[2]);
                $route_base = implode('/', $base_url_arr).'/';
            ?>
            localStorage.setItem("authToken", "<?php if (Auth::check()) { echo Auth::user()->api_token;} else { echo "";} ?>");
            localStorage.setItem("routeBase", "<?php echo $route_base;?>");
            localStorage.setItem("baseUrl", "<?php echo URL::to('/');?>");
            localStorage.setItem("csrfToken", "<?php echo csrf_token();?>");
            localStorage.setItem("userRole", "<?php echo Auth::user()->role;?>");
        }
    </script>
</head>
<body>

    @yield('content')
     
    <!-- Scripts -->
    <script src="{{ asset('/public/js/app.js') }}"></script>
    <!-- jQuery -->
    <script src="{{ asset('/public/plugins/jquery/jquery.min.js') }}"></script>
    <!-- jQuery UI 1.11.4 -->
    <script src="{{ asset('/public/plugins/jquery-ui/jquery-ui.min.js') }}"></script>
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script>
    $.widget.bridge('uibutton', $.ui.button)
    </script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('/public/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- overlayScrollbars -->
    <script src="{{ asset('/public/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js') }}"></script>
    <!-- AdminLTE App -->
    <script src="{{ asset('/public/dist/js/adminlte.js') }}"></script>
    <script src="{{ asset('/public/js/custom.js') }}"></script>
    
</body>
</html>
