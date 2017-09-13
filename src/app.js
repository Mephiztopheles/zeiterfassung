const SEKUNDE = 1000;
const MINUTE  = SEKUNDE * 60;
const STUNDE  = MINUTE * 60;

Date.prototype.clearTime = function () {
    this.setHours( 0 );
    this.setMinutes( 0 );
    this.setSeconds( 0 );
    this.setMilliseconds( 0 );
    return this;
};

String.prototype.decapitalize = function () {
    return this[ 0 ].toLowerCase() + this.substr( 1 );
};

const class2type = {},
      toString   = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error".split( " " ).forEach( function ( name ) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

/**
 * returns real type of object
 * @param obj
 * @returns {*}
 */
function getType( obj ) {
    if ( obj === null ) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[ toString.call( obj ) ] || "object" : typeof obj;
}

angular.module( "zeiterfassung", [] ).run( [ "$rootScope", "Projekt", function ( $rootScope, Projekt ) {
    Projekt.list().then( response => {
        $rootScope.projekte = response;
        console.log( response );
        $rootScope.layout = "view/zeiterfassung.html";
        console.log( $rootScope );
    } );
} ] ).filter( "dauer", () => ( ms ) => {
    let stunden = Math.floor( ms / 3600000 );
    let minuten = Math.floor( ms / 60000 ) - stunden * 60;
    return `${stunden}:${minuten <= 9 ? "0" + minuten : minuten}`;
} );