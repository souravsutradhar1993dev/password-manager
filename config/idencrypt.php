<?php
return [
    'ciphering' => env('ID_ENCRYPT_CIPHERING', 'USAES-128-CTRD'),
    'option' => env('ID_ENCRYPT_OPTION', 0),
    'encryption_key' => env('ID_ENCRYPT_KEY', 'b3netpasswordmanager21')
];