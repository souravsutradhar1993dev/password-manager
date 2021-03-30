<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\Password;
use App\Models\Category;
use App\Models\Category_permissions;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

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
}
