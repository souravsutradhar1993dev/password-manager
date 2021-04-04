<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\Password;
use App\Models\Category;
use App\Models\User;
use App\Models\exportedFile;
use App\Models\Category_permissions;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class PasswordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $current_user_id = Auth::user()->id;
        
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required'],
            'password_users' => ['array']
        ]);
        if ($validator->fails()) { 
            $validation_messages = [];
            $errors = $validator->errors();
            $error_message = '';
            foreach($errors->all() as $error) {
                $error_message .= '<p>'.$error.'</p>';
            }
            $validation_messages = ['success' => false, 'message' => $error_message];
            return response()->json($validation_messages);
        }

        $data = $request->all();
        $main_data = $request->all();
        $data['category'] = !is_numeric($data['category']) ? decrypt($data['category']) : $data['category'];
        unset($main_data['name']);
        unset($main_data['category']);
        unset($main_data['account_type']);
        unset($main_data['password_users']);
        $encrypted_data = '';
        if(count($main_data)) {
            $encrypted_data = Crypt::encryptString(serialize($main_data));
        }
        
        $password = new Password;
        $password->name = trim($data['name']);
        $password->data = $encrypted_data;
        $password->category_id = $data['category'];
        $password->account_type = $data['account_type'];
        $password->active = 1;
        $password->created_by = $current_user_id;
        $is_saved = $password->save();
      
        $category_permission_data = [];
        $password_user_id = [];
        foreach($data['password_users'] as $password_user) {
            
            if(!in_array($password_user['id'], $password_user_id)) {
                array_push($password_user_id, $password_user['id']);
                $data = [];
            
                $data['category_id'] = $password->id;
                $data['user_id'] = $password_user['id'];
                $data['permission_type'] = $password_user['permission_type'];
                $data['type'] = 'password';
                array_push($category_permission_data, $data);
            }
        }
        Category_permissions::insert($category_permission_data);

        return response()
            ->json(['success'=> true, 'message' => 'Data saved successfully']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if(!empty($id)) {
            $id = decrypt($id);
            if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
                $password = Password::where('id', $id)->first()->toArray();
            }else {
                $password = Password::where([['id', $id],['created_by', Auth::user()->id]])->first()->toArray();
            }
            $category_title = '';
            if($password['category_id']  > 0) {
                $category = Category::find($password['category_id']);
                $category_title = $category->title;
            }
            
            $dec_data = Crypt::decryptString($password['data']);
            $data_arr = unserialize($dec_data);
            foreach($data_arr as $key => $item) {
                $data_arr[$key] = $item == null ? '' : $item;
            }
            unset($password['data']);
            if($password) {
                $password_permissions = DB::table('category_permissions')
                            ->select('category_permissions.permission_type', 'users.name', 'users.id')
                            ->join('users','category_permissions.user_id','=','users.id')
                            ->where(['category_permissions.type' => 'password', 'category_permissions.category_id' => $id])->orderBy('category_permissions.id', 'DESC')->get()->toArray();            
            }

            return response()
                ->json(['success'=> true, 'password' => $password, 'password_data' => $data_arr, 'password_permissions' => $password_permissions, 'category_title' => $category_title]);
        }else {
            return response()
                ->json(['success'=> true, 'password' => [], 'password_data' => [], 'password_permissions' => [], 'category_title' => '']);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $current_user_id = Auth::user()->id;
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $password = Password::where('id', $id)->first()->toArray();
        }else {
            $password = Password::where([['id', $id],['created_by', Auth::user()->id]])->first()->toArray();
        }
        

        if($password) {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
                'category' => ['required'],
                'password_users' => ['array']
            ]);
            if ($validator->fails()) { 
                $validation_messages = [];
                $errors = $validator->errors();
                $error_message = '';
                foreach($errors->all() as $error) {
                    $error_message .= '<p>'.$error.'</p>';
                }
                $validation_messages = ['success' => false, 'message' => $error_message];
                return response()->json($validation_messages);
            }
    
            $data = $request->all();
            $data['category'] = !is_numeric($data['category']) ? decrypt($data['category']) : $data['category'];
            $main_data = $request->all();
            unset($main_data['name']);
            unset($main_data['category']);
            unset($main_data['account_type']);
            unset($main_data['password_users']);
            $encrypted_data = '';
            if(count($main_data)) {
                $encrypted_data = Crypt::encryptString(serialize($main_data));
            }
            
            $password = Password::find($id);
            $password->name = trim($data['name']);
            $password->data = $encrypted_data;
            $password->category_id = $data['category'];
            $password->account_type = $data['account_type'];
            $password->active = 1;
            $is_saved = $password->save();
            Category_permissions::where([['category_id', $id], ['type', 'password']])->delete();
            $category_permission_data = [];
            $password_user_id = [];
            foreach($data['password_users'] as $password_user) {
                
                if(!in_array($password_user['id'], $password_user_id)) {
                    array_push($password_user_id, $password_user['id']);
                    $data = [];
                
                    $data['category_id'] = $password->id;
                    $data['user_id'] = $password_user['id'];
                    $data['permission_type'] = $password_user['permission_type'];
                    $data['type'] = 'password';
                    array_push($category_permission_data, $data);
                }
            }
      
            Category_permissions::insert($category_permission_data);
    
            return response()
                ->json(['success'=> true, 'message' => 'Data updated successfully']);
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $has_password = Password::where('id', $id)->first()->toArray();
        }else {
            $has_password = Password::where([['id', $id], ['created_by', Auth::user()->id]])->first()->toArray();
        }

        if($has_password) {
            $password = Password::find($id);
            $password->active = 0;
            
            $is_password_updated = $password->save();
            if($is_password_updated) {
                return response()
                ->json(['success'=> true, 'message' => 'Password removed successfully']);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
            }
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function upload_csv(Request $request) 
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            
            $validator = Validator::make(
                [
                    'file'      => $request->file('csv_file'),
                    'extension' => strtolower($request->file('csv_file')->getClientOriginalExtension()),
                ],
                [
                    'file'          => 'required',
                    'extension'      => 'required|in:csv',
                ]
            );

            if ($validator->fails()) { 
                $validation_messages = [];
                $errors = $validator->errors();
                $error_message = '';
                foreach($errors->all() as $error) {
                    $error_message .= '<p>'.$error.'</p>';
                }
                $validation_messages = ['success' => false, 'message' => $error_message];
                return response()->json($validation_messages);
            }
            $accountTypes = [];
            $accountTypes['ftp'] = 'FTP Account';
            $accountTypes['cpanel'] = 'Hosting Control Panel Account';
            $accountTypes['gsuite'] = 'Gsuites Account';
            $accountTypes['social'] = 'Social Media Account';
            $accountTypes['web'] = 'Web Account';
            $accountTypes['email'] = 'Email Account';
            $accountTypes['wifi'] = 'Wifi Account';
            $accountTypes['credit'] = 'Card Card Account';
            $accountTypes['crypto'] = 'Cryptocurrency';
            $accountTypes['custom'] = 'Custom Account';

            $csvData = csvToArray($request->file('csv_file'));
            
            if(count($csvData)) {
                foreach($csvData as $key => $csv) {
                    $password_data = [];
                    $category = Category::select('id')->where([['title', trim($csv[0])], ['active', 1]])->first()->toArray();
                    
                    if(count($category) && isset($category['id'])) {
                        $account_type_key = array_search(trim($csv[1]), $accountTypes);
                        if(!empty($account_type_key)) {
                            $password_data['name'] = trim($csv[3]);
                            $password_data['category_id'] = $category['id'];
                            $password_data['account_type'] = $account_type_key;
                            $password_data['active'] = 1;
                            $password_data['created_by'] = Auth::user()->id;
                            $password_data['created_at'] = date('Y-m-d H:i:s');
                            $password_data['updated_at'] = date('Y-m-d H:i:s');
                            $encrypt_data = [];
                            switch($account_type_key) {
                                case 'ftp' :
                                    $encrypt_data['url'] = $csv[4];
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'cpanel' :
                                    $encrypt_data['url'] = $csv[4];
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'gsuite' :
                                    $encrypt_data['email'] = $csv[5];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'social' :
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'web' :
                                    $encrypt_data['url'] = $csv[4];
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'email' :
                                    $encrypt_data['email'] = $csv[5];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'wifi' :
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'credit' :
                                    $encrypt_data['number'] = $csv[8];
                                    $encrypt_data['date'] = $csv[9];
                                    $encrypt_data['cvv'] = $csv[10];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'crypto' :
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['seed'] = $csv[11];
                                    $encrypt_data['notes'] = $csv[12];
                                break;
                                case 'custom' :
                                    $encrypt_data['url'] = $csv[4];
                                    $encrypt_data['username'] = $csv[6];
                                    $encrypt_data['password'] = $csv[7];
                                    $encrypt_data['email'] = $csv[5];
                                    $encrypt_data['notes'] = $csv[12];
                                break;

                            }
                            $password_data['data'] = Crypt::encryptString(serialize($encrypt_data));
                            $password_id = DB::table('passwords')->insertGetId($password_data);
                            
                            if(!empty(trim($csv[2]))) {
                                $emails = explode(',', $csv[2]);
                                $category_permission = [];
                                if(count($emails)) {
                                    foreach($emails as $email) {
                                        $user = User::select('id')->where('email', trim($email))->first()->toArray();
                                        if(count($user) && isset($user['id'])) {
                                            $category_permission_data['category_id'] = $password_id;
                                            $category_permission_data['user_id'] = $user['id'];
                                            $category_permission_data['permission_type'] = 'view';
                                            $category_permission_data['type'] = 'password';
                                            array_push($category_permission, $category_permission_data);
                                        }
                                    }
                                    Category_permissions::insert($category_permission);
                                }
                            }
                        }
                    }
                }
            }
            return response()
             ->json(['success'=> true, 'message' => 'Data imported successfully']);
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function export_csv(Request $request)
    {
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $post_data = $request->all();
            $post_data['category_id'] = isset($post_data['category_id']) && !empty($post_data['category_id']) ? decrypt($post_data['category_id']) : '';
            $current_datetime = date('Y-m-d H:i:s');
            $fileName = 'passwords_'.strtotime($current_datetime).'.csv';
            if(isset($post_data['category_id']) && !empty($post_data['category_id'])) {
                $passwords = Password::where('category_id', $post_data['category_id'])->get();
            }else {
                $passwords = Password::all();
            }

            $headers = array(
                "Content-type"        => "text/csv",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma"              => "no-cache",
                "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
                "Expires"             => "0"
            );

            $csvFile = tmpfile();
            $csvPath = stream_get_meta_data($csvFile)['uri'];

            $columns = array('Account Name', 'Account Type', 'Name', 'URL', 'Email', 'Username', 'Password','Card Number', 'Expiration Date', 'CVV', 'Seed', 'Notes');

            $accountTypes = [];
            $accountTypes['ftp'] = 'FTP Account';
            $accountTypes['cpanel'] = 'Hosting Control Panel Account';
            $accountTypes['gsuite'] = 'Gsuites Account';
            $accountTypes['social'] = 'Social Media Account';
            $accountTypes['web'] = 'Web Account';
            $accountTypes['email'] = 'Email Account';
            $accountTypes['wifi'] = 'Wifi Account';
            $accountTypes['credit'] = 'Card Card Account';
            $accountTypes['crypto'] = 'Cryptocurrency';
            $accountTypes['custom'] = 'Custom Account';

            $file = fopen($csvPath, 'w');
            fputcsv($file, $columns);

            foreach ($passwords as $password) {
                $category = Category::find($password->category_id);
                if($category) {
                    
                    $row['Account Name']  = $category->title;
                    $row['Account Type']    = array_search($password->account_type, $accountTypes);
                    $row['Name']    = $password->name;
                    $row['URL']  = '';
                    $row['Email']  = '';
                    $row['Username']  = '';
                    $row['Password']  = '';
                    $row['Card Number']  = '';
                    $row['Expiration Date']  = '';
                    $row['CVV']  = '';
                    $row['Seed']  = '';
                    $row['Notes']  = '';

                    $dec_data = Crypt::decryptString($password->data);
                    $data_arr = unserialize($dec_data);

                    switch($password->account_type) {
                        case 'ftp' :
                            $row['URL']  = isset($data_arr['url']) ? $data_arr['url'] : '';
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'cpanel' :
                            $row['URL']  = isset($data_arr['url']) ? $data_arr['url'] : '';
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'gsuite' :
                            $row['Email']  = isset($data_arr['email']) ? $data_arr['email'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'social' :
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'web' :
                            $row['URL']  = isset($data_arr['url']) ? $data_arr['url'] : '';
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'email' :
                            $row['Email']  = isset($data_arr['email']) ? $data_arr['email'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'wifi' :
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'credit' :
                            $row['Card Number']  = isset($data_arr['number']) ? $data_arr['number'] : '';
                            $row['Expiration Date']  = isset($data_arr['date']) ? $data_arr['date'] : '';
                            $row['CVV']  = isset($data_arr['cvv']) ? $data_arr['cvv'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'crypto' :
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Seed']  = isset($data_arr['seed']) ? $data_arr['seed'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                        case 'custom' :
                            $row['URL']  = isset($data_arr['url']) ? $data_arr['url'] : '';
                            $row['Email']  = isset($data_arr['email']) ? $data_arr['email'] : '';
                            $row['Username']  = isset($data_arr['username']) ? $data_arr['username'] : '';
                            $row['Password']  = isset($data_arr['password']) ? $data_arr['password'] : '';
                            $row['Notes']  = isset($data_arr['notes']) ? $data_arr['notes'] : '';
                        break;
                    }
                    fputcsv($file, array($row['Account Name'], $row['Account Type'], $row['Name'], $row['URL'], $row['Email'], $row['Username'], $row['Password'], $row['Card Number'], $row['Expiration Date'], $row['CVV'], $row['Seed'], $row['Notes']));
                }
            }

            fclose($file);

             $res = Storage::putFileAs('public', $csvPath, $fileName);
             if(!empty($res)) {
                $exportedFile = new exportedFile;
                $exportedFile->title = $fileName;
                $exportedFile->save();
                $url = Storage::url($fileName);
                if(!empty($url)) {
                    return response()
                        ->json(['success'=> true, 'url' => asset('public'.$url)]);
                }else {
                    return response()
                         ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
                } 
             }else {
                return response()
                         ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
             }
             
            
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }
}
