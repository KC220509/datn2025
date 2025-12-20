<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Contract\Database;
use Kreait\Firebase\Factory;


class FirebaseServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        $this->app->singleton(Factory::class, function ($app) {
           
            return (new Factory)
                ->withServiceAccount(base_path(config('firebase.credentials')))
                ->withDatabaseUri(config('firebase.database_url'));
        });

        $this->app->bind(FirebaseAuth::class, function ($app) {
            return $app->make(Factory::class)->createAuth();
        });

        $this->app->bind(Database::class, function ($app) {
            return $app->make(Factory::class)->createDatabase();
        });

        $this->app->singleton(FirebaseAuth::class, function ($app) {
        return $app->make(Factory::class)->createAuth();
    });
    }

    public function boot(): void
    {
        //
    }
}
