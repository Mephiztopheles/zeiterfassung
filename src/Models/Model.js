angular.module( environment.name ).service( "Model", [ "$http", function ( $http ) {
    class Model {

        constructor( data ) {
            Object.assign( this, data );
            let c    = this.constructor;
            let list = Model.instances[ c.name ];
            if ( !list )
                list = Model.instances[ c.name ] = [];
            list.push( this );
            if ( this.id === undefined ) {
                this.id = null;
            }
            this.init();
        }

        save() {
            return $http.post( `${environment.api}/${this.constructor.controller}/save.php`,this ).then( response => Object.assign( this, response.data ) );
        }

        static get() {
            return $http.get( `${environment.api}/${this.controller}/get.php?id=${id}` ).then( response => new this( response.data ) );
        }

        static list() {
            return $http.get( `${environment.api}/${this.controller}/list.php` ).then( response => {
                let json = response.data;
                let list = [];
                json.forEach( item => list.push( new this( item ) ) );
                return list;
            } );
        }

        init() {
        }
    }

    Model.instances = {};
    return Model;
} ] );