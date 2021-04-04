<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\exportedFile;
use Illuminate\Support\Facades\Storage;
use DateTime;

class cleanExportedFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exportfile:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will clean exported csv files for security purposes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $date = new DateTime;
        $date->modify('-5 minutes');
        $formatted_date = $date->format('Y-m-d H:i:s');
        $exportedFiles = exportedFile::where('created_at','<=',$formatted_date)->get();
        
        if(count($exportedFiles)) {
            foreach ($exportedFiles as $key => $item) {
                Storage::delete('public/'.$item->title);
                $exportedFile = exportedFile::find($item->id);
                $exportedFile->delete();
            }
        }
    }
}
