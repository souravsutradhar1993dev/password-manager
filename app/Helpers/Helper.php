<?php
if (!function_exists('buildTree')) {
    function buildTree(array $elements, $parentId = 0, $type = 'dropdown', $selected_value = 0) {
        $branch = array();
    
        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $children = buildTree($elements, $element['value'], $type, $selected_value);
                
                if ($children) {
                    if($type == 'dropdown') {
                        if($selected_value > 0) {
                            if($selected_value == $element['value']) {
                                $element['checked'] = true;
                            }
                        }
                        
                        unset($element['parent_id']);
                    }
                    if($type == 'menu') {
                        unset($element['parent_id']);
                        //unset($element['value']);
                    }
                    $element['children'] = $children;
                }
                if($type == 'dropdown') {
                    if($selected_value > 0) {
                        if($selected_value == $element['value']) {
                            $element['checked'] = true;
                        }
                    }
                    
                    unset($element['parent_id']);
                }
                if($type == 'menu') {
                    unset($element['parent_id']);
                    //unset($element['value']);  
                }
                $branch[] = $element;
            }
        }
    
        return $branch;
    }
}

if (!function_exists('encrypt')) {
    function encrypt($string) {
        $ciphering = config('idencrypt.ciphering');
        $options = config('idencrypt.option');
        $encryption_key = config('idencrypt.encryption_key');
        $ivlen = openssl_cipher_iv_length($cipher);
        $iv = openssl_random_pseudo_bytes($ivlen);

        return openssl_encrypt($string, $ciphering, 
            $encryption_key, $options, $iv);
    }
}

if (!function_exists('decrypt')) {
    function decrypt($string) {
        $ciphering = config('idencrypt.ciphering');
        $options = config('idencrypt.option');
        $encryption_key = config('idencrypt.encryption_key');
        $ivlen = openssl_cipher_iv_length($cipher);
        $iv = openssl_random_pseudo_bytes($ivlen);

        return openssl_decrypt ($string, $ciphering,  
        $encryption_key, $options, $iv);
    }
}

if (!function_exists('csvToArray')) {
    function csvToArray($filename = '', $delimiter = ',')
    {
        if (!file_exists($filename) || !is_readable($filename))
            return false;

        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== false)
        {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== false)
            {
                if (!$header)
                    $header = $row;
                else
                    //$data[] = array_combine($header, $row);
                    $data[] = $row;
            }
            fclose($handle);
        }

        return $data;
    }
}