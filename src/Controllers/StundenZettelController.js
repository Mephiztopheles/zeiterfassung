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

        if ( $scope.current ) {
            $scope.entry.save().then( response => {
                Object.assign( $scope.current, response );
                $scope.setFilter();
            } );
        } else {
            $scope.entry.save().then( response => {
                $scope.stundenzettel.push( response );
                $scope.setFilter();
            } );
        }
        $scope.cancel();
    };
    $scope.cancel      = function () {
        $scope.entry   = null;
        $scope.current = null;
    };
    $scope.create      = function () {
        let data           = {};
        let letzterEintrag = $scope.stundenZettelGefiltert.sort( ( a, b ) => a.ende.getTime() < b.ende.getTime() ? 1 : -1 )[ 0 ];
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

    StundenZettel.list().then( response => {
        $scope.stundenzettel = response;
        $scope.setFilter();
    } );
}

StundenZettelController.$inject = [ "$scope", "StundenZettel" ];

angular.module( environment.name ).controller( "StundenZettelController", StundenZettelController );