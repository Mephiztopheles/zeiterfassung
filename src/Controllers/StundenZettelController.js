function StundenZettelController( $scope, StundenZettel ) {
    $scope.filter      = {
        //start: (new Date()).clearTime()
    };
    $scope.setFilter   = function () {
        $scope.stundenZettelGefiltert = $scope.stundenzettel.filter( item => {
            if ( $scope.filter.start ) {
                let itemValue   = new Date( item.start );
                let filterValue = new Date( $scope.filter.start );
                itemValue.clearTime();
                filterValue.clearTime();
                if ( itemValue.getTime() < filterValue.getTime() ) {
                    return false;
                }
            }
            if ( $scope.filter.ende ) {
                let itemValue   = new Date( item.ende );
                let filterValue = new Date( $scope.filter.ende );
                itemValue.clearTime();
                filterValue.clearTime();
                if ( itemValue.getTime() > filterValue.getTime() ) {
                    return false;
                }
            }
            for ( let property in $scope.filter ) {
                if ( $scope.filter.hasOwnProperty( property ) ) {
                    let filterValue = $scope.filter[ property ];
                    // noinspection EqualityComparisonWithCoercionJS
                    if ( filterValue != null ) {
                        let itemValue = item[ property ];
                        if ( typeof filterValue === "object" ) {
                            if ( itemValue && itemValue.id !== filterValue.id ) {
                                return false;
                            }
                        } else if ( itemValue instanceof Date ) {

                        } else {
                            if ( itemValue !== filterValue ) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        } ).sort( ( a, b ) => a.start.getTime() > b.start.getTime() ? 1 : -1 );

    };
    $scope.edit        = function ( eintrag ) {
        $scope.entry   = new StundenZettel( eintrag );
        $scope.current = eintrag;
        console.log( $scope.entry );
    };
    $scope.save        = function () {

        $scope.entry.ende.setFullYear( $scope.entry.start.getFullYear() );
        $scope.entry.ende.setMonth( $scope.entry.start.getMonth() );
        $scope.entry.ende.setDate( $scope.entry.start.getDate() );
        let response;
        if ( $scope.current ) {
            response = $scope.entry.save().then( response => {
                console.log( response );
                Object.assign( $scope.current, response );
            } );
        } else {
            response = $scope.entry.save().then( response => {
                $scope.stundenzettel.push( response );
            } );
        }
        response.then( () => {
            $scope.setFilter();
            $scope.cancel();
        } );
    };
    $scope.cancel      = function () {
        $scope.entry   = null;
        $scope.current = null;
    };
    $scope.create      = function () {
        let data           = {};
        let letzterEintrag = Object.assign( [], $scope.stundenZettelGefiltert ).sort( ( a, b ) => a.ende.getTime() < b.ende.getTime() ? 1 : -1 )[ 0 ];
        if ( $scope.filter.start ) {
            data.start = new Date( $scope.filter.start );
            data.start.setHours( 8 );
        } else if ( letzterEintrag ) {
            data.start = new Date( letzterEintrag.ende );
        }
        $scope.entry = new StundenZettel( data );
    };
    $scope.gesamtDauer = function () {
        let dauer = 0;
        if ( $scope.stundenZettelGefiltert )
            $scope.stundenZettelGefiltert.forEach( item => {
                dauer += item.dauer;
            } );
        return dauer;
    };
    $scope.delete      = function ( eintrag ) {
        eintrag.delete().then( () => {
            let index = $scope.stundenzettel.indexOf( eintrag );
            $scope.stundenzettel.splice( index, 1 );
            $scope.setFilter();
        } );
    };

    StundenZettel.list().then( response => {
        $scope.stundenzettel = response;
        $scope.stundenzettel.forEach( item => {
            if ( item.projekt )
                item.projekt = $scope.projekte.find( it => it.id === item.projekt.id );
        } );
        $scope.setFilter();
    } );
}

StundenZettelController.$inject = [ "$scope", "StundenZettel" ];

angular.module( environment.name ).controller( "StundenZettelController", StundenZettelController );