angular.module( environment.name ).service( "Projekt", [ "Model", function ( Model ) {

    class Projekt extends Model {
    }

    Projekt.controller = "projekt";
    return Projekt;
} ] );