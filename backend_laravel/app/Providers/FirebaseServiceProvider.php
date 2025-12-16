<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Factory;


class FirebaseServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        $this->app->singleton(Factory::class, function ($app) {
           
            return (new Factory)
                ->withServiceAccount(config('firebase.credentials'))
                ->withDatabaseUri(config('firebase.database_url'));
        });

        $this->app->bind(Auth::class, function ($app) {
            return $app->make(Factory::class)->createAuth();
        });
    }

    public function boot(): void
    {
        //
    }
}
