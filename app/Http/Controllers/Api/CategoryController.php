<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\Category;
use App\Models\Password;
use App\Models\User;
use App\Models\Category_activity;
use App\Models\Category_permissions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $type = trim($_GET['type']);
        $data_type = isset($_GET['data_type']) ? $_GET['data_type'] : "";
        $category_id = isset($_GET['id']) && !empty($_GET['id']) ? decrypt(trim($_GET['id'])) : 0;
        $category_id = (int) $category_id;
        
        $cat_arr = [];
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $categories = Category::where('active', 1)->orderBy('title', 'ASC')->get();
        }else {
            $categories = Category::where([['created_by', Auth::user()->id], ['active', 1]])->orderBy('title', 'ASC')->get();
        }
        
        if($type == 'menu') {
            foreach($categories as $key => $category) {
                $cat_arr[$key]['label'] = $category->title;
                $cat_arr[$key]['value'] = $category->id;
                $cat_arr[$key]['encrypt_id'] = encrypt($category->id);
                $cat_arr[$key]['category_icon'] = $category->category_icon;
                $cat_arr[$key]['parent_id'] = $category->category_parent_id;
            }
        
            $cat_tree = buildTree($cat_arr, 0, 'menu');
           
        }else {
            if($data_type == 'parent') {
                $single_cat = Category::find($category_id);
                $category_id = $single_cat['category_parent_id'];;
            }
            
            foreach($categories as $key => $category) {
                $cat_arr[$key]['label'] = $category->title;
                $cat_arr[$key]['value'] = $category->id;
                $cat_arr[$key]['parent_id'] = $category->category_parent_id;
            }

            $cat_tree = buildTree($cat_arr, 0, 'dropdown', $category_id);

        }

        return response()
            ->json(['success'=> true, 'data' => $cat_tree]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

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
            'category_name' => ['required', 'string', 'max:255'],
            'category_icon' => ['required', 'string'],
            'category_users' => ['array']
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
        $data['parent_category_id'] = empty($data['parent_category_id']) ? 0 : $data['parent_category_id'];
        $data['parent_category_id'] = !is_numeric($data['parent_category_id']) ? decrypt($data['parent_category_id']) : $data['parent_category_id'];
        $category = new Category;
        $category->title = trim($data['category_name']);
        $category->category_icon = $data['category_icon'];
        $category->active = 1;
        $category->created_by = $current_user_id;
        $category->category_parent_id = $data['parent_category_id'];
        $is_saved = $category->save();

        $category_permission_data = [];
        $category_user_id = [];
        foreach($data['category_users'] as $category_user) {
            
            if(!in_array($category_user['id'], $category_user_id)) {
                array_push($category_user_id, $category_user['id']);
                $data = [];
            
                $data['category_id'] = $category->id;
                $data['user_id'] = $category_user['id'];
                $data['permission_type'] = $category_user['permission_type'];
                $data['type'] = 'category';
                array_push($category_permission_data, $data);
            }
        }
        Category_permissions::insert($category_permission_data);

        return response()
            ->json(['success'=> true, 'message' => 'Account saved successfully']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category_id = decrypt($id);
        $current_category_name = '';
        $current_category_id = '';
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $currentCategory = Category::select('title', 'category_icon', 'id')->where([['active', 1], ['id', $category_id]])->first();
        }else {
            $currentCategory = Category::select('title', 'category_icon', 'id')->where([['created_by', Auth::user()->id], ['active', 1], ['id', $category_id]])->first();
        }
        
        if($currentCategory) {
            $current_category_name = $currentCategory['title'];
            $current_category_id = encrypt($currentCategory['id']);
            if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
                $categories = Category::select('title', 'category_icon', 'id')->where([['active', 1], ['category_parent_id', $category_id]])->orderBy('id', 'DESC')->get()->toArray();
            }else {
                $categories = Category::select('title', 'category_icon', 'id')->where([['created_by', Auth::user()->id], ['active', 1], ['category_parent_id', $category_id]])->orderBy('id', 'DESC')->get()->toArray();
            }
            
        
            foreach($categories as $key => $category) {
                $categories[$key]['id'] = encrypt($category['id']);
            }

            if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
                $passwords = Password::select('name', 'account_type', 'id')->where([['active', 1], ['category_id', $category_id]])->orderBy('id', 'DESC')->get()->toArray();
            }else {
                $passwords = Password::select('name', 'account_type', 'id')->where([['created_by', Auth::user()->id], ['active', 1], ['category_id', $category_id]])->orderBy('id', 'DESC')->get()->toArray();
            }
    
            foreach($passwords as $key => $password) {
                $passwords[$key]['id'] = encrypt($password['id']);
            }
            Category_activity::where([['user_id', Auth::user()->id], ['category_id', $category_id]])->delete();
            $category_activities = new Category_activity;
            $category_activities->user_id = Auth::user()->id;
            $category_activities->category_id = $category_id;
            $category_activities->type = 'owned';
            $category_activities->save();
        }else {
            $categories = [];
            $passwords = [];
        }


        return response()
            ->json(['success'=> true, 'current_category_name' => $current_category_name, 'current_category_id' => $current_category_id, 'data' => ['passwords' => $passwords, 'categories' => $categories]]);
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
                $category = Category::where('id', $id)->first()->toArray();
            }else {
                $category = Category::where([['id', $id], ['created_by', Auth::user()->id]])->first()->toArray();
            }
            
            if($category) {
                $category_permissions = DB::table('category_permissions')
                            ->select('category_permissions.permission_type', 'users.name', 'users.id')
                            ->join('users','category_permissions.user_id','=','users.id')
                            ->where(['category_permissions.type' => 'category', 'category_permissions.category_id' => $id])->orderBy('category_permissions.id', 'DESC')->get()->toArray();            
            }

            return response()
                ->json(['success'=> true, 'category' => $category, 'category_permissions' => $category_permissions]);
        }else {
            return response()
            ->json(['success'=> true, 'category' => [], 'category_permissions' => []]); 
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
            $has_category = Category::where('id', $id)->first()->toArray();
        }else {
            $has_category = Category::where([['id', $id], ['created_by', $current_user_id]])->first()->toArray();
        }   

        if($has_category) {
            $validator = Validator::make($request->all(), [
                'category_name' => ['required', 'string', 'max:255'],
                'category_icon' => ['required', 'string'],
                'category_users' => ['array']
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
            $data['parent_category_id'] = empty($data['parent_category_id']) ? 0 : $data['parent_category_id'];
            $data['parent_category_id'] = !is_numeric($data['parent_category_id']) ? decrypt($data['parent_category_id']) : $data['parent_category_id'];
            $category = Category::find($id);
            $category->title = trim($data['category_name']);
            $category->category_icon = $data['category_icon'];
            $category->active = 1;
            $category->category_parent_id = $data['parent_category_id'];
            $is_saved = $category->save();
          
            $category_permission_data = [];
            $category_user_id = [];
            foreach($data['category_users'] as $category_user) {
                
                if(!in_array($category_user['id'], $category_user_id)) {
                    array_push($category_user_id, $category_user['id']);
                    $data = [];
                
                    $data['category_id'] = $category->id;
                    $data['user_id'] = $category_user['id'];
                    $data['permission_type'] = $category_user['permission_type'];
                    $data['type'] = 'category';
                    array_push($category_permission_data, $data);
                }
            }
            Category_permissions::insert($category_permission_data);
    
            return response()
                ->json(['success'=> true, 'message' => 'Account updated successfully']);
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
        $id = decrypt($id);
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $has_category = Category::where('id', $id)->first()->toArray();
        }else {
            $has_category = Category::where([['id', $id], ['created_by', Auth::user()->id]])->first()->toArray();
        }
        

        if($has_category) {
            $category = Category::find($id);
            $category->active = 0;
            
            $is_category_updated = $category->save();
            if($is_category_updated) {
                return response()
                ->json(['success'=> true, 'message' => 'Account removed successfully']);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'Some error occurs.Please try again.']);
            }
        }else {
            return response()
            ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function get_all_category() {
        $categories = [];
        $passwords = [];
        if(Auth::user()->role == 'admin' || Auth::user()->role == 'super-admin') {
            $categories = Category::select('title', 'category_icon', 'id')->where([['active', 1], ['category_parent_id', 0]])->orderBy('title', 'ASC')->get()->toArray();
        }else {
            $categories = Category::select('title', 'category_icon', 'id')->where([['created_by', Auth::user()->id], ['active', 1], ['category_parent_id', 0]])->orderBy('title', 'ASC')->get()->toArray();
        }
        
    
        foreach($categories as $key => $category) {
            $categories[$key]['id'] = encrypt($category['id']);
        }

        $current_category_name = '';

        $current_category_id = '';

        return response()
            ->json(['success'=> true, 'current_category_name' => $current_category_name, 'current_category_id' => $current_category_id, 'data' => ['passwords' => $passwords, 'categories' => $categories]]);
    }

    public function get_shared() {
        $categories = [];
        $passwords = [];
        $category_name = '';
        $category_id = '';
        $category_permission = '';
        $id = isset($_GET['id']) && !empty($_GET['id']) ? decrypt($_GET['id']) : '';

        if(Auth::user()->role == 'employee') {
            if($id != '') {
                $category = Category::find($id);
                $category_name = $category['title'];
                $category_id = encrypt($category['id']);
                $permission = Category_permissions::select("permission_type")->where([['category_id', $id],['user_id', Auth::user()->id]])->first();
                $category_permission = $permission['permission_type'];
                
                $categories = DB::table('categories')
                            ->select('categories.title', 'categories.category_icon', 'categories.id', 'category_permissions.permission_type')
                            ->join('category_permissions','category_permissions.category_id','=','categories.id')
                            ->where(['categories.active' => 1, 'category_permissions.type' => 'category', 'category_permissions.user_id' => Auth::user()->id, 'category_parent_id'=> $id])->orderBy('categories.id', 'DESC')->get();
                Category_activity::where([['user_id', Auth::user()->id], ['category_id', $id]])->delete();
                $category_activities = new Category_activity;
                $category_activities->user_id = Auth::user()->id;
                $category_activities->category_id = $id;
                $category_activities->type = 'share';
                $category_activities->save();
            }else {
                $categories = DB::table('categories')
                            ->select('categories.title', 'categories.category_icon', 'categories.id', 'category_permissions.permission_type')
                            ->join('category_permissions','category_permissions.category_id','=','categories.id')
                            ->where(['categories.active' => 1, 'category_permissions.type' => 'category', 'category_permissions.user_id' => Auth::user()->id])->orderBy('categories.id', 'DESC')->get();
            }
            
    
            foreach($categories as $key => $category) {
                $categories[$key]->id = encrypt($category->id);
            }
            if($id != '') {
                $passwords = DB::table('passwords')
                            ->select('passwords.name', 'passwords.account_type', 'passwords.id', 'category_permissions.permission_type')
                            ->join('category_permissions','category_permissions.category_id','=','passwords.id')
                            ->where(['passwords.active' => 1, 'category_permissions.type' => 'password', 'category_permissions.user_id' => Auth::user()->id, 'passwords.category_id' => $id])->orderBy('passwords.id', 'DESC')->get();
            }else {
                $passwords = DB::table('passwords')
                            ->select('passwords.name', 'passwords.account_type', 'passwords.id', 'category_permissions.permission_type')
                            ->join('category_permissions','category_permissions.category_id','=','passwords.id')
                            ->where(['passwords.active' => 1, 'category_permissions.type' => 'password', 'category_permissions.user_id' => Auth::user()->id])->orderBy('passwords.id', 'DESC')->get();
            }
            

            foreach($passwords as $key => $password) {
                $passwords[$key]->id = encrypt($password->id);
            }
        }
        if($id != '') {
            return response()
            ->json(['success'=> true, 'data' => ['passwords' => $passwords, 'categories' => $categories, 'category_name' => $category_name, 'category_id' => $category_id, 'category_permission' => $category_permission]]);
        }else {
            return response()
            ->json(['success'=> true, 'data' => ['passwords' => $passwords, 'categories' => $categories]]);
        }
        
    }

    public function show_shared_category($id) {
        $id = decrypt($id);
        if(Auth::user()->role == 'employee') {
            $has_permission = Category_permissions::where([['user_id', Auth::user()->id],['category_id', $id],['type', 'category']])->get()->toArray();
            $user_data = [];
            if($has_permission) {
                $category = Category::select('title', 'category_icon', 'created_by')->where('id', $id)->first()->toArray();
                $user = User::find($category['created_by']);
                $user_data['name'] = $user['name'];
                $user_data['email'] = $user['email'];
                return response()
                    ->json(['success'=> true, 'category' => $category, 'user_data' => $user_data]);
            }else {
                return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
            }
            
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function show_shared_password($id) {
        $id = decrypt($id);
        if(Auth::user()->role == 'employee') {
            $has_permission = Category_permissions::where([['user_id', Auth::user()->id],['category_id', $id],['type', 'password']])->get()->toArray();
            $user_data = [];
            if($has_permission) {
                $password = Password::select('name', 'account_type', 'data', "created_by")->where('id', $id)->first()->toArray();
                $user = User::find($password['created_by']);
                $user_data['name'] = $user['name'];
                $user_data['email'] = $user['email'];
                $dec_data = Crypt::decryptString($password['data']);
                $data_arr = unserialize($dec_data);
                unset($password['data']);

                return response()
                    ->json(['success'=> true, 'password' => $password, 'password_data' => $data_arr, 'user_data' => $user_data]);
            }else {
                return response()
                    ->json(['success'=> false, 'message' => 'You do not have permission']);
            }
            
        }else {
            return response()
                ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function update_shared_category(Request $request, $id) {
        $current_user_id = Auth::user()->id;
        $id = decrypt($id);
        if(Auth::user()->role == 'employee') {
            $has_permission = Category_permissions::where([['user_id', Auth::user()->id],['category_id', $id],['type', 'category'], ['permission_type', 'edit']])->get()->toArray();
            if($has_permission) {
                $validator = Validator::make($request->all(), [
                    'category_name' => ['required', 'string', 'max:255'],
                    'category_icon' => ['required', 'string'],
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
                $category = Category::find($id);
                $category->title = trim($data['category_name']);
                $category->category_icon = $data['category_icon'];
                $category->active = 1;
                $is_saved = $category->save();
        
                return response()
                    ->json(['success'=> true, 'message' => 'Category updated successfully']);
            }else {
                return response()
                    ->json(['success'=> false, 'message' => 'You do not have permission']);
            }
        }else {
            return response()
                    ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
    }

    public function update_shared_password(Request $request, $id) {
        $id = decrypt($id);
        $current_user_id = Auth::user()->id;
        if(Auth::user()->role == 'employee') {
            $has_permission = Category_permissions::where([['user_id', Auth::user()->id],['category_id', $id],['type', 'password'], ['permission_type', 'edit']])->get()->toArray();
            if($has_permission) {
                $validator = Validator::make($request->all(), [
                    'name' => ['required', 'string', 'max:255'],
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
        
                unset($main_data['name']);
                unset($main_data['account_type']);
                $encrypted_data = '';
                if(count($main_data)) {
                    $encrypted_data = Crypt::encryptString(serialize($main_data));
                }
                
                $password = Password::find($id);
                $password->name = trim($data['name']);
                $password->data = $encrypted_data;
                $password->active = 1;
                $is_saved = $password->save();
        
                return response()
                    ->json(['success'=> true, 'message' => 'Data updated successfully']);
            }else {
                return response()
                    ->json(['success'=> false, 'message' => 'You do not have permission']);
            }
        }else {
            return response()
                    ->json(['success'=> false, 'message' => 'You do not have permission']);
        }
       
    }

    public function get_recent() {
        $category_activities = DB::table('category_activities')
                                ->select('category_activities.type', 'categories.title', 'categories.id', 'categories.category_icon')
                                ->join('categories','category_activities.category_id','=','categories.id')
                                ->where(['category_activities.user_id' => Auth::user()->id, 'categories.active' => 1])
                                ->limit(4)
                                ->orderByDesc('category_activities.created_at')
                                ->get();
        foreach($category_activities as $key => $category_activity) {
            $category_activities[$key]->id = encrypt($category_activity->id);
        }
        return response()
            ->json(['success'=> false, 'data' => $category_activities]);
    }
}
